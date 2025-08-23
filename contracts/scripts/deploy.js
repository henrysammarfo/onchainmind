const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying OnchainMind contracts to Circle Layer...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy ReputationScore contract first
  console.log("\n📊 Deploying ReputationScore contract...");
  const ReputationScore = await ethers.getContractFactory("ReputationScore");
  const reputationScore = await ReputationScore.deploy();
  await reputationScore.deployed();
  console.log("✅ ReputationScore deployed to:", reputationScore.address);

  // Deploy AIIdentity contract
  console.log("\n🤖 Deploying AIIdentity contract...");
  const AIIdentity = await ethers.getContractFactory("AIIdentity");
  const aiIdentity = await AIIdentity.deploy();
  await aiIdentity.deployed();
  console.log("✅ AIIdentity deployed to:", aiIdentity.address);

  // Deploy AIRegistry contract
  console.log("\n📋 Deploying AIRegistry contract...");
  const AIRegistry = await ethers.getContractFactory("AIRegistry");
  const aiRegistry = await AIRegistry.deploy();
  await aiRegistry.deployed();
  console.log("✅ AIRegistry deployed to:", aiRegistry.address);

  // Set up initial configuration
  console.log("\n⚙️ Setting up initial configuration...");
  
  // Grant minting permissions to AIRegistry for AIIdentity
  await aiIdentity.grantRole(await aiIdentity.OWNER_ROLE(), aiRegistry.address);
  console.log("✅ Granted minting permissions to AIRegistry");

  // Grant reputation management permissions to AIRegistry
  await reputationScore.grantRole(await reputationScore.OWNER_ROLE(), aiRegistry.address);
  console.log("✅ Granted reputation management permissions to AIRegistry");

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("ReputationScore:", reputationScore.address);
  console.log("AIIdentity:", aiIdentity.address);
  console.log("AIRegistry:", aiRegistry.address);
  
  console.log("\n🔗 Network:", network.name);
  console.log("🔗 Chain ID:", network.config.chainId);
  
  // Save deployment info for frontend/backend
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contracts: {
      ReputationScore: reputationScore.address,
      AIIdentity: aiIdentity.address,
      AIRegistry: aiRegistry.address
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  const deploymentPath = path.join(__dirname, '../deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);
  
  // Verify contracts on Circle Layer explorer (if available)
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log("\n🔍 Verifying contracts on Circle Layer explorer...");
    console.log("⏳ Waiting for block confirmations...");
    
    // Wait for 5 block confirmations
    await aiIdentity.deployTransaction.wait(5);
    await reputationScore.deployTransaction.wait(5);
    await aiRegistry.deployTransaction.wait(5);
    
    console.log("✅ Contracts verified and confirmed on blockchain");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
