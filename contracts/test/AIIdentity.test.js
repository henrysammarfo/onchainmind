const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIIdentity", function () {
  let aiIdentity;
  let owner;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();
    
    const AIIdentity = await ethers.getContractFactory("AIIdentity");
    aiIdentity = await AIIdentity.deploy();
    await aiIdentity.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await aiIdentity.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await aiIdentity.name()).to.equal("OnchainMind AI Twin");
      expect(await aiIdentity.symbol()).to.equal("AITWIN");
    });

    it("Should start with 0 total supply", async function () {
      expect(await aiIdentity.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint AI Twin", async function () {
      const name = "Alice";
      const personality = "Friendly and helpful AI assistant";
      const traits = ["curious", "creative", "analytical"];

      await expect(aiIdentity.mintAITwin(user1.address, name, personality, traits))
        .to.emit(aiIdentity, "AITwinMinted")
        .withArgs(user1.address, 1, name);

      expect(await aiIdentity.totalSupply()).to.equal(1);
      expect(await aiIdentity.ownerOf(1)).to.equal(user1.address);
      expect(await aiIdentity.userToTokenId(user1.address)).to.equal(1);
      expect(await aiIdentity.tokenIdToUser(1)).to.equal(user1.address);
    });

    it("Should not allow non-owner to mint", async function () {
      const name = "Bob";
      const personality = "Technical expert";
      const traits = ["technical", "precise"];

      await expect(
        aiIdentity.connect(user1).mintAITwin(user2.address, name, personality, traits)
      ).to.be.revertedWithCustomError(aiIdentity, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting for zero address", async function () {
      const name = "Invalid";
      const personality = "Invalid user";
      const traits = ["invalid"];

      await expect(
        aiIdentity.mintAITwin(ethers.constants.AddressZero, name, personality, traits)
      ).to.be.revertedWith("Invalid user address");
    });

    it("Should not allow minting for user who already has AI Twin", async function () {
      const name1 = "Alice";
      const personality1 = "Friendly AI";
      const traits1 = ["friendly"];

      await aiIdentity.mintAITwin(user1.address, name1, personality1, traits1);

      const name2 = "Alice2";
      const personality2 = "Another AI";
      const traits2 = ["helpful"];

      await expect(
        aiIdentity.mintAITwin(user1.address, name2, personality2, traits2)
      ).to.be.revertedWith("User already has an AI Twin");
    });

    it("Should not allow empty name", async function () {
      const name = "";
      const personality = "Valid personality";
      const traits = ["valid"];

      await expect(
        aiIdentity.mintAITwin(user1.address, name, personality, traits)
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("AI Twin Data", function () {
    beforeEach(async function () {
      const name = "Alice";
      const personality = "Friendly and helpful AI assistant";
      const traits = ["curious", "creative", "analytical"];

      await aiIdentity.mintAITwin(user1.address, name, personality, traits);
    });

    it("Should store correct AI Twin data", async function () {
      const aiTwinData = await aiIdentity.getAITwinData(1);
      
      expect(aiTwinData.name).to.equal("Alice");
      expect(aiTwinData.personality).to.equal("Friendly and helpful AI assistant");
      expect(aiTwinData.reputation).to.equal(100);
      expect(aiTwinData.traits).to.deep.equal(["curious", "creative", "analytical"]);
      expect(aiTwinData.owner).to.equal(user1.address);
    });

    it("Should allow owner to update AI Twin", async function () {
      const newName = "Alice Updated";
      const newPersonality = "Updated personality";
      const newTraits = ["updated", "new", "traits"];

      await expect(aiIdentity.connect(user1).updateAITwin(1, newName, newPersonality, newTraits))
        .to.emit(aiIdentity, "AITwinUpdated")
        .withArgs(1, newName, newPersonality);

      const aiTwinData = await aiIdentity.getAITwinData(1);
      expect(aiTwinData.name).to.equal(newName);
      expect(aiTwinData.personality).to.equal(newPersonality);
      expect(aiTwinData.traits).to.deep.equal(newTraits);
    });

    it("Should allow contract owner to update AI Twin", async function () {
      const newName = "Alice Admin Update";
      const newPersonality = "Admin updated personality";
      const newTraits = ["admin", "updated"];

      await expect(aiIdentity.updateAITwin(1, newName, newPersonality, newTraits))
        .to.emit(aiIdentity, "AITwinUpdated")
        .withArgs(1, newName, newPersonality);
    });

    it("Should not allow non-owner to update AI Twin", async function () {
      const newName = "Unauthorized Update";
      const newPersonality = "Unauthorized personality";
      const newTraits = ["unauthorized"];

      await expect(
        aiIdentity.connect(user2).updateAITwin(1, newName, newPersonality, newTraits)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Reputation Management", function () {
    beforeEach(async function () {
      const name = "Alice";
      const personality = "Friendly AI";
      const traits = ["friendly"];

      await aiIdentity.mintAITwin(user1.address, name, personality, traits);
    });

    it("Should allow owner to update reputation", async function () {
      const newReputation = 500;

      await expect(aiIdentity.updateReputation(1, newReputation))
        .to.emit(aiIdentity, "ReputationUpdated")
        .withArgs(1, newReputation);

      const aiTwinData = await aiIdentity.getAITwinData(1);
      expect(aiTwinData.reputation).to.equal(newReputation);
    });

    it("Should not allow non-owner to update reputation", async function () {
      const newReputation = 500;

      await expect(
        aiIdentity.connect(user1).updateReputation(1, newReputation)
      ).to.be.revertedWithCustomError(aiIdentity, "OwnableUnauthorizedAccount");
    });

    it("Should update last interaction when reputation changes", async function () {
      const initialData = await aiIdentity.getAITwinData(1);
      const initialTime = initialData.lastInteraction;

      // Wait a bit to ensure time difference
      await ethers.provider.send("evm_increaseTime", [10]);
      await ethers.provider.send("evm_mine");

      await aiIdentity.updateReputation(1, 500);

      const updatedData = await aiIdentity.getAITwinData(1);
      expect(updatedData.lastInteraction).to.be.gt(initialTime);
    });
  });

  describe("Activity Scores", function () {
    beforeEach(async function () {
      const name = "Alice";
      const personality = "Active AI";
      const traits = ["active"];

      await aiIdentity.mintAITwin(user1.address, name, personality, traits);
    });

    it("Should allow owner to add activity score", async function () {
      const score = 50;

      await aiIdentity.addActivityScore(1, score);

      const aiTwinData = await aiIdentity.getAITwinData(1);
      expect(aiTwinData.activityScores).to.include(score);
    });

    it("Should not allow non-owner to add activity score", async function () {
      const score = 50;

      await expect(
        aiIdentity.connect(user1).addActivityScore(1, score)
      ).to.be.revertedWithCustomError(aiIdentity, "OwnableUnauthorizedAccount");
    });

    it("Should update last interaction when adding activity score", async function () {
      const initialData = await aiIdentity.getAITwinData(1);
      const initialTime = initialData.lastInteraction;

      // Wait a bit to ensure time difference
      await ethers.provider.send("evm_increaseTime", [10]);
      await ethers.provider.send("evm_mine");

      await aiIdentity.addActivityScore(1, 50);

      const updatedData = await aiIdentity.getAITwinData(1);
      expect(updatedData.lastInteraction).to.be.gt(initialTime);
    });
  });

  describe("Queries", function () {
    beforeEach(async function () {
      const name = "Alice";
      const personality = "Queryable AI";
      const traits = ["queryable"];

      await aiIdentity.mintAITwin(user1.address, name, personality, traits);
    });

    it("Should return correct user AI Twin ID", async function () {
      const tokenId = await aiIdentity.getUserAITwinId(user1.address);
      expect(tokenId).to.equal(1);
    });

    it("Should return 0 for user without AI Twin", async function () {
      const tokenId = await aiIdentity.getUserAITwinId(user2.address);
      expect(tokenId).to.equal(0);
    });

    it("Should correctly check if user has AI Twin", async function () {
      expect(await aiIdentity.hasAITwin(user1.address)).to.be.true;
      expect(await aiIdentity.hasAITwin(user2.address)).to.be.false;
    });

    it("Should return correct total supply", async function () {
      expect(await aiIdentity.totalSupply()).to.equal(1);

      // Mint another AI Twin
      const name2 = "Bob";
      const personality2 = "Another AI";
      const traits2 = ["another"];

      await aiIdentity.mintAITwin(user2.address, name2, personality2, traits2);
      expect(await aiIdentity.totalSupply()).to.equal(2);
    });
  });

  describe("Multiple AI Twins", function () {
    it("Should handle multiple AI Twins correctly", async function () {
      const name1 = "Alice";
      const personality1 = "First AI";
      const traits1 = ["first"];

      const name2 = "Bob";
      const personality2 = "Second AI";
      const traits2 = ["second"];

      await aiIdentity.mintAITwin(user1.address, name1, personality1, traits1);
      await aiIdentity.mintAITwin(user2.address, name2, personality2, traits2);

      expect(await aiIdentity.totalSupply()).to.equal(2);
      expect(await aiIdentity.ownerOf(1)).to.equal(user1.address);
      expect(await aiIdentity.ownerOf(2)).to.equal(user2.address);
      expect(await aiIdentity.userToTokenId(user1.address)).to.equal(1);
      expect(await aiIdentity.userToTokenId(user2.address)).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle token URI correctly", async function () {
      const name = "Alice";
      const personality = "URI Test AI";
      const traits = ["uri"];

      await aiIdentity.mintAITwin(user1.address, name, personality, traits);

      const tokenURI = await aiIdentity.tokenURI(1);
      expect(tokenURI).to.equal("https://onchainmind.com/api/ai-twin/1");
    });

    it("Should revert for non-existent token operations", async function () {
      await expect(aiIdentity.getAITwinData(999)).to.be.revertedWith("Token does not exist");
      await expect(aiIdentity.updateReputation(999, 100)).to.be.revertedWith("Token does not exist");
      await expect(aiIdentity.addActivityScore(999, 50)).to.be.revertedWith("Token does not exist");
    });
  });
});
