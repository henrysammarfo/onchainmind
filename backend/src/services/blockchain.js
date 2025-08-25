const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.network = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🔗 Initializing Blockchain Service...');
      
      // Load deployment info
      const deploymentPath = path.join(__dirname, '../../../contracts/deployment.json');
      let deploymentInfo;
      
      try {
        const deploymentData = fs.readFileSync(deploymentPath, 'utf8');
        deploymentInfo = JSON.parse(deploymentData);
        console.log('📋 Loaded deployment info:', deploymentInfo.network);
      } catch (error) {
        console.log('⚠️ No deployment info found, using environment variables');
        deploymentInfo = {
          network: process.env.NETWORK || 'circleLayer',
          chainId: parseInt(process.env.CHAIN_ID) || 28525,
          contracts: {
            ReputationScore: process.env.REPUTATION_SCORE_ADDRESS,
            AIIdentity: process.env.AI_IDENTITY_ADDRESS,
            AIRegistry: process.env.AI_REGISTRY_ADDRESS
          }
        };
      }

      // Initialize provider based on network
      if (process.env.NODE_ENV === 'development' || process.env.NETWORK === 'localhost') {
        // Try Circle Layer testnet first, fallback to localhost
        try {
          const rpcUrl = process.env.CIRCLE_LAYER_RPC_URL || 'https://testnet.circle.com/rpc';
          this.provider = new ethers.JsonRpcProvider(rpcUrl);
          this.network = deploymentInfo.network;
          console.log(`🔗 Connected to ${this.network} network`);
        } catch (error) {
          console.log('⚠️ Circle Layer connection failed, using mock provider');
          this.provider = null;
          this.network = 'mock';
        }
      } else {
        // Circle Layer testnet
        try {
          const rpcUrl = process.env.CIRCLE_LAYER_RPC_URL || 'https://testnet.circle.com/rpc';
          this.provider = new ethers.JsonRpcProvider(rpcUrl);
          this.network = deploymentInfo.network;
          console.log(`🔗 Connected to ${this.network} network`);
        } catch (error) {
          console.log('⚠️ Circle Layer connection failed, using mock provider');
          this.provider = null;
          this.network = 'mock';
        }
      }

      // Initialize signer if private key is provided
      if (process.env.PRIVATE_KEY) {
        this.signer = this.provider ? new ethers.Wallet(process.env.PRIVATE_KEY, this.provider) : null;
        console.log('🔑 Signer initialized with private key');
      } else {
        console.log('⚠️ No private key provided, read-only mode');
      }

      // Load contract ABIs
      try {
        await this.loadContractABIs();
      } catch (error) {
        console.log('⚠️ Contract ABIs not found, using mock mode');
      }
      
      // Initialize contracts
      if (this.provider && this.contractABIs) {
        await this.initializeContracts(deploymentInfo.contracts);
      }
      
      // Verify network connection
      if (this.provider) {
        await this.verifyNetwork(deploymentInfo.chainId);
      }
      
      this.isInitialized = true;
      console.log('✅ Blockchain Service initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Blockchain Service:', error);
      throw error;
    }
  }

  /**
   * Load contract ABIs from compiled artifacts
   */
  async loadContractABIs() {
    try {
      const artifactsPath = path.join(__dirname, '../../../contracts/artifacts/contracts');
      
      // Load AIIdentity ABI
      const aiIdentityPath = path.join(artifactsPath, 'AIIdentity.sol/AIIdentity.json');
      if (fs.existsSync(aiIdentityPath)) {
        const aiIdentityArtifact = JSON.parse(fs.readFileSync(aiIdentityPath, 'utf8'));
        this.contractABIs = {
          AIIdentity: aiIdentityArtifact.abi
        };

        // Load ReputationScore ABI
        const reputationScorePath = path.join(artifactsPath, 'ReputationScore.sol/ReputationScore.json');
        if (fs.existsSync(reputationScorePath)) {
          const reputationScoreArtifact = JSON.parse(fs.readFileSync(reputationScorePath, 'utf8'));
          this.contractABIs.ReputationScore = reputationScoreArtifact.abi;
        }

        // Load AIRegistry ABI
        const aiRegistryPath = path.join(artifactsPath, 'AIRegistry.sol/AIRegistry.json');
        if (fs.existsSync(aiRegistryPath)) {
          const aiRegistryArtifact = JSON.parse(fs.readFileSync(aiRegistryPath, 'utf8'));
          this.contractABIs.AIRegistry = aiRegistryArtifact.abi;
        }

        console.log('📋 Contract ABIs loaded successfully');
      } else {
        throw new Error('Contract artifacts not found');
      }
    } catch (error) {
      console.error('❌ Error loading contract ABIs:', error);
      throw error;
    }
  }

  /**
   * Initialize contract instances
   */
  async initializeContracts(contractAddresses) {
    try {
      if (!this.contractABIs) {
        throw new Error('Contract ABIs not loaded');
      }

      // Initialize AIIdentity contract
      if (contractAddresses.AIIdentity) {
        this.contracts.AIIdentity = new ethers.Contract(
          contractAddresses.AIIdentity,
          this.contractABIs.AIIdentity,
          this.signer || this.provider
        );
        console.log('🤖 AIIdentity contract initialized');
      }

      // Initialize ReputationScore contract
      if (contractAddresses.ReputationScore) {
        this.contracts.ReputationScore = new ethers.Contract(
          contractAddresses.ReputationScore,
          this.contractABIs.ReputationScore,
          this.signer || this.provider
        );
        console.log('📊 ReputationScore contract initialized');
      }

      // Initialize AIRegistry contract
      if (contractAddresses.AIRegistry) {
        this.contracts.AIRegistry = new ethers.Contract(
          contractAddresses.AIRegistry,
          this.contractABIs.AIRegistry,
          this.signer || this.provider
        );
        console.log('📋 AIRegistry contract initialized');
      }

    } catch (error) {
      console.error('❌ Error initializing contracts:', error);
      throw error;
    }
  }

  /**
   * Verify network connection
   */
  async verifyNetwork(expectedChainId) {
    try {
      const network = await this.provider.getNetwork();
      console.log(`🔗 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      if (expectedChainId && network.chainId !== expectedChainId) {
        console.warn(`⚠️ Warning: Expected Chain ID ${expectedChainId}, got ${network.chainId}`);
      }
      
      return network;
    } catch (error) {
      console.error('❌ Error verifying network:', error);
      throw error;
    }
  }

  /**
   * Get contract instance
   */
  getContract(contractName) {
    if (!this.isInitialized) {
      throw new Error('Blockchain Service not initialized');
    }
    
    const contract = this.contracts[contractName];
    if (!contract) {
      throw new Error(`Contract ${contractName} not found`);
    }
    
    return contract;
  }

  /**
   * Get provider
   */
  getProvider() {
    if (!this.isInitialized) {
      throw new Error('Blockchain Service not initialized');
    }
    
    return this.provider;
  }

  /**
   * Get signer
   */
  getSigner() {
    if (!this.isInitialized) {
      throw new Error('Blockchain Service not initialized');
    }
    
    return this.signer;
  }

  /**
   * Check if service is in read-only mode
   */
  isReadOnly() {
    return !this.signer;
  }

  /**
   * Get current gas price
   */
  async getGasPrice() {
    try {
      const gasPrice = await this.provider.getFeeData();
      return gasPrice.gasPrice;
    } catch (error) {
      console.error('❌ Error getting gas price:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(contract, method, args = []) {
    try {
      const gasEstimate = await contract[method].estimateGas(...args);
      return gasEstimate;
    } catch (error) {
      console.error('❌ Error estimating gas:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, confirmations = 1) {
    try {
      console.log(`⏳ Waiting for transaction ${txHash} to be confirmed...`);
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      return receipt;
    } catch (error) {
      console.error('❌ Error waiting for transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        return { status: 'pending', confirmations: 0 };
      }
      
      const latestBlock = await this.provider.getBlockNumber();
      const confirmations = latestBlock - receipt.blockNumber;
      
      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        confirmations,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice.toString()
      };
    } catch (error) {
      console.error('❌ Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Get account nonce
   */
  async getNonce(address) {
    try {
      const nonce = await this.provider.getTransactionCount(address);
      return nonce;
    } catch (error) {
      console.error('❌ Error getting nonce:', error);
      throw error;
    }
  }

  /**
   * Get latest block number
   */
  async getLatestBlockNumber() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('❌ Error getting latest block:', error);
      throw error;
    }
  }

  /**
   * Get block information
   */
  async getBlock(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
        transactions: block.transactions.length,
        gasLimit: block.gasLimit.toString(),
        gasUsed: block.gasUsed.toString()
      };
    } catch (error) {
      console.error('❌ Error getting block:', error);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const latestBlock = await this.provider.getBlockNumber();
      const gasPrice = await this.getGasPrice();
      
      return {
        name: network.name,
        chainId: network.chainId,
        latestBlock,
        gasPrice: gasPrice ? ethers.formatUnits(gasPrice, 'gwei') : 'unknown',
        isReadOnly: this.isReadOnly()
      };
    } catch (error) {
      console.error('❌ Error getting network info:', error);
      throw error;
    }
  }

  /**
   * Health check for blockchain service
   */
  async healthCheck() {
    try {
      if (!this.isInitialized) {
        return { status: 'not_initialized', error: 'Blockchain service not initialized' };
      }

      if (!this.provider) {
        return {
          status: 'mock_mode',
          network: this.network,
          chainId: 28525,
          latestBlock: 12345,
          isReadOnly: true,
          contracts: Object.keys(this.contracts),
          timestamp: new Date().toISOString()
        };
      }

      const network = await this.provider.getNetwork();
      const latestBlock = await this.provider.getBlockNumber();
      
      return {
        status: 'healthy',
        network: network.name,
        chainId: Number(network.chainId),
        latestBlock,
        isReadOnly: this.isReadOnly(),
        contracts: Object.keys(this.contracts),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

// Initialize function
async function initializeBlockchain() {
  await blockchainService.initialize();
}

module.exports = {
  blockchainService,
  initializeBlockchain
};
