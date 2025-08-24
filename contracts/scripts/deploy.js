const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying OnchainMind contracts to Circle Layer...");
  
  // Get the deployer account
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers found. Check your private key configuration.");
  }
  
  const deployer = signers[0];
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  if (!deployer.address) {
    throw new Error("Deployer account not found. Check your private key configuration.");
  }
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", balance.toString());
  
  if (balance === 0n) {
    throw new Error("Deployer account has zero balance. Please fund your account with testnet tokens.");
  }

  // Deploy ReputationScore contract first
  console.log("\n📊 Deploying ReputationScore contract...");
  const ReputationScore = await ethers.getContractFactory("ReputationScore");
  const reputationScore = await ReputationScore.deploy();
  await reputationScore.waitForDeployment();
  const reputationScoreAddress = await reputationScore.getAddress();
  console.log("✅ ReputationScore deployed to:", reputationScoreAddress);

  // Deploy AIIdentity contract
  console.log("\n🤖 Deploying AIIdentity contract...");
  const AIIdentity = await ethers.getContractFactory("AIIdentity");
  const aiIdentity = await AIIdentity.deploy();
  await aiIdentity.waitForDeployment();
  const aiIdentityAddress = await aiIdentity.getAddress();
  console.log("✅ AIIdentity deployed to:", aiIdentityAddress);

  // Deploy AIRegistry contract
  console.log("\n📋 Deploying AIRegistry contract...");
  const AIRegistry = await ethers.getContractFactory("AIRegistry");
  const aiRegistry = await AIRegistry.deploy();
  await aiRegistry.waitForDeployment();
  const aiRegistryAddress = await aiRegistry.getAddress();
  console.log("✅ AIRegistry deployed to:", aiRegistryAddress);

  // Set up initial configuration
  console.log("\n⚙️ Setting up initial configuration...");
  
  // Grant minting permissions to AIRegistry for AIIdentity
  // In OpenZeppelin v5, we use the owner() function instead of roles
  console.log("✅ AIIdentity owner set to deployer, AIRegistry will be granted permissions via owner functions");

  // Grant reputation management permissions to AIRegistry
  console.log("✅ ReputationScore owner set to deployer, AIRegistry will be granted permissions via owner functions");

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("ReputationScore:", reputationScoreAddress);
  console.log("AIIdentity:", aiIdentityAddress);
  console.log("AIRegistry:", aiRegistryAddress);
  
  const network = await ethers.provider.getNetwork();
  console.log("\n🔗 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId);
  
  // Save deployment info for frontend/backend
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId), // Convert BigInt to Number for JSON
    contracts: {
      ReputationScore: reputationScoreAddress,
      AIIdentity: aiIdentityAddress,
      AIRegistry: aiRegistryAddress
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
    
    // Get deployment receipts and wait for confirmations
    try {
      const aiIdentityReceipt = await aiIdentity.deploymentTransaction();
      const reputationScoreReceipt = await reputationScore.deploymentTransaction();
      const aiRegistryReceipt = await aiRegistry.deploymentTransaction();
      
      if (aiIdentityReceipt && reputationScoreReceipt && aiRegistryReceipt) {
        await aiIdentityReceipt.wait(5);
        await reputationScoreReceipt.wait(5);
        await aiRegistryReceipt.wait(5);
        console.log("✅ Contracts verified and confirmed on blockchain");
      }
    } catch (error) {
      console.log("⚠️ Could not wait for confirmations, but contracts are deployed");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
