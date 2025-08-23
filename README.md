# OnchainMind - AI-powered Onchain Identity & SocialFi dApp

> **Revolutionary dApp where each user has an AI-powered onchain "AI Twin" NFT that learns from wallet activity and provides personalized insights on Circle Layer**

![OnchainMind Banner](https://img.shields.io/badge/OnchainMind-AI%20Twin%20NFT%20dApp-blue?style=for-the-badge&logo=ethereum)
![Circle Layer](https://img.shields.io/badge/Circle%20Layer-Testnet-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🚀 Overview

OnchainMind is a cutting-edge decentralized application that combines AI technology with blockchain identity on Circle Layer. Each user gets a unique AI Twin NFT that:

- **Learns** from wallet activity and on-chain behavior
- **Generates** personalized responses and insights
- **Manages** reputation points through interactions
- **Interacts** autonomously with dApps and users
- **Evolves** based on user engagement and blockchain activity

## ✨ Features

### 🤖 AI Twin NFTs
- **Unique Personalities**: Each AI Twin has distinct traits, skills, and characteristics
- **Learning Capabilities**: AI Twins learn from wallet transactions and user interactions
- **Personalized Responses**: Context-aware conversations based on user's blockchain history
- **Continuous Evolution**: AI Twins improve and adapt over time

### 🏆 Reputation System
- **ERC20-style Points**: Earn reputation through interactions and activities
- **Level Progression**: Unlock achievements and higher tiers
- **Leaderboard Rankings**: Compete with other users in the ecosystem
- **Social Recognition**: Build credibility within the OnchainMind community

### 🔗 Circle Layer Integration
- **Ultra-Fast Transactions**: Leverage Circle Layer's high-performance infrastructure
- **Low Gas Fees**: Cost-effective operations for users
- **Real-time Updates**: Instant blockchain confirmations and state changes
- **Scalable Architecture**: Built for mass adoption

### 💬 Interactive Features
- **Live Chat Interface**: Real-time conversations with your AI Twin
- **WebSocket Integration**: Instant updates and notifications
- **Responsive Dashboard**: Modern, mobile-friendly user interface
- **Social Connections**: Connect with other AI Twins and users

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Smart         │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Contracts     │
│                 │    │                 │    │   (Solidity)    │
│ • Wallet Connect│    │ • AI Service    │    │ • AIIdentity    │
│ • Dashboard     │    │ • Blockchain    │    │ • Reputation    │
│ • Chat Interface│    │ • WebSocket     │    │ • AIRegistry    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Circle Layer  │    │   OpenAI API    │    │   MetaMask      │
│   Testnet       │    │   (LangChain)   │    │   Wallet        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Wagmi + RainbowKit** - Web3 wallet integration
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js + Express** - API server
- **Socket.io** - WebSocket server
- **LangChain** - AI/LLM integration
- **OpenAI API** - GPT-4 language model
- **Ethers.js** - Blockchain interaction

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Security libraries
- **Hardhat** - Development framework
- **Circle Layer** - High-performance L2

### AI & ML
- **LangChain** - LLM orchestration
- **OpenAI GPT-4** - Language model
- **Vector Embeddings** - Knowledge storage
- **Memory Management** - Conversation history

## 📁 Project Structure

```
onchainmind/
├── contracts/                 # Smart contracts
│   ├── contracts/            # Solidity source files
│   │   ├── AIIdentity.sol   # AI Twin NFT contract
│   │   ├── ReputationScore.sol # Reputation system
│   │   └── AIRegistry.sol   # AI Twin registry
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── hardhat.config.js     # Hardhat configuration
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── server.js        # Main server file
│   └── package.json
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Next.js pages
│   │   └── styles/          # CSS styles
│   └── package.json
├── ai/                       # AI scripts and logic
├── scripts/                  # Utility scripts
├── docs/                     # Documentation
└── package.json              # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MetaMask** or compatible Web3 wallet
- **Circle Layer** testnet access
- **OpenAI API** key (for AI features)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/onchainmind.git
cd onchainmind
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, frontend, backend, contracts)
npm run install:all

# Or install individually:
npm install                    # Root dependencies
cd frontend && npm install    # Frontend dependencies
cd ../backend && npm install  # Backend dependencies
cd ../contracts && npm install # Smart contract dependencies
```

### 3. Environment Setup

Create `.env` files in the following locations:

#### Root `.env`
```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### Backend `.env`
```bash
PORT=5000
HOST=0.0.0.0
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# Blockchain Configuration
NETWORK=circleLayer
CIRCLE_LAYER_RPC_URL=https://testnet.circle.com/rpc
CHAIN_ID=1234

# Contract Addresses (after deployment)
REPUTATION_SCORE_ADDRESS=0x...
AI_IDENTITY_ADDRESS=0x...
AI_REGISTRY_ADDRESS=0x...

# Optional: Private key for admin operations
PRIVATE_KEY=your_private_key_here
```

#### Frontend `.env.local`
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_NETWORK=circleLayer
NEXT_PUBLIC_CHAIN_ID=1234
```

### 4. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Circle Layer testnet
npm run deploy

# Or deploy to local Hardhat network
npm run deploy:local
```

### 5. Start Development Servers

```bash
# Start both frontend and backend (from root)
npm run dev

# Or start individually:
npm run dev:frontend    # Frontend on http://localhost:3000
npm run dev:backend     # Backend on http://localhost:5000
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration

### Smart Contract Configuration

The smart contracts are configured through the `hardhat.config.js` file:

```javascript
networks: {
  circleLayer: {
    url: process.env.CIRCLE_LAYER_RPC_URL,
    chainId: 1234, // Replace with actual Circle Layer testnet chain ID
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    gasPrice: 1000000000, // 1 gwei
    gas: 6000000
  }
}
```

### AI Service Configuration

Configure the AI service in `backend/src/services/ai.js`:

```javascript
this.llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_MODEL || 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000
});
```

### Frontend Configuration

Configure Web3 providers in the frontend hooks:

```typescript
const { data: signer } = useSigner();
const { data: account } = useAccount();
const { data: network } = useNetwork();
```

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
npm run test
```

### Backend API Tests

```bash
cd backend
npm run test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## 📊 Usage Examples

### 1. Mint AI Twin NFT

```typescript
const aiTwinData = {
  name: "Alice",
  personality: "Friendly and helpful AI assistant",
  traits: ["curious", "creative", "analytical"],
  skills: ["blockchain analysis", "financial advice", "technical support"]
};

const result = await mintAITwin(aiTwinData);
```

### 2. Chat with AI Twin

```typescript
const response = await sendMessage("What's my current reputation score?");
console.log(response.message);
```

### 3. Check Reputation

```typescript
const reputation = await getReputationScore();
console.log(`Level: ${reputation.level}, Score: ${reputation.score}`);
```

### 4. Update AI Twin

```typescript
const updates = {
  personality: "Updated personality description",
  traits: ["new", "updated", "traits"]
};

await updateAITwin(updates);
```

## 🔒 Security Features

- **Access Control**: Role-based permissions for smart contracts
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Communication**: HTTPS and WSS for all communications
- **Private Key Management**: Secure handling of cryptographic keys

## 🌐 Deployment

### Production Deployment

1. **Smart Contracts**: Deploy to Circle Layer mainnet
2. **Backend**: Deploy to cloud provider (AWS, GCP, Azure)
3. **Frontend**: Deploy to Vercel, Netlify, or similar
4. **Environment Variables**: Set production environment variables
5. **Domain Configuration**: Configure custom domain and SSL

### Environment Variables for Production

```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
OPENAI_API_KEY=your_production_openai_key
CIRCLE_LAYER_RPC_URL=https://mainnet.circle.com/rpc
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style

- **JavaScript/TypeScript**: ESLint + Prettier
- **Solidity**: Solhint + Prettier
- **CSS**: TailwindCSS classes
- **Git**: Conventional commits

## 📚 API Documentation

### REST API Endpoints

- `POST /api/ai-twin/mint` - Mint new AI Twin
- `GET /api/ai-twin/:id` - Get AI Twin details
- `PUT /api/ai-twin/:id` - Update AI Twin
- `POST /api/chat/message` - Send chat message
- `GET /api/reputation/leaderboard` - Get reputation leaderboard

### WebSocket Events

- `join-user-room` - Join user's personal room
- `chat-message` - Send/receive chat messages
- `reputation-update` - Real-time reputation updates

## 🐛 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check RPC URL and network configuration
   - Verify private key has sufficient balance
   - Check gas price and limit settings

2. **AI Service Not Working**
   - Verify OpenAI API key is valid
   - Check API rate limits and quotas
   - Ensure environment variables are set correctly

3. **Frontend Connection Issues**
   - Check wallet network configuration
   - Verify contract addresses are correct
   - Check browser console for errors

4. **Backend Service Errors**
   - Check environment variables
   - Verify database connections
   - Check log files for detailed errors

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev:backend

# Frontend
NEXT_PUBLIC_DEBUG=true npm run dev:frontend
```

## 📈 Performance Optimization

- **Smart Contract**: Gas optimization and efficient data structures
- **Backend**: Caching, connection pooling, and async operations
- **Frontend**: Code splitting, lazy loading, and optimized bundles
- **AI Service**: Vector database optimization and response caching

## 🔮 Future Roadmap

### Phase 1: Core Features ✅
- [x] AI Twin NFT minting
- [x] Basic reputation system
- [x] Chat interface
- [x] Circle Layer integration

### Phase 2: Advanced Features 🚧
- [ ] Multi-chain support
- [ ] Advanced AI capabilities
- [ ] Social features and groups
- [ ] Mobile application

### Phase 3: Ecosystem Expansion 📋
- [ ] AI Twin marketplace
- [ ] Cross-dApp integrations
- [ ] Governance system
- [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Circle Layer** for the high-performance blockchain infrastructure
- **OpenAI** for the advanced language models
- **OpenZeppelin** for secure smart contract libraries
- **Hardhat** for the development framework
- **Next.js** for the React framework

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/onchainmind/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/onchainmind/discussions)
- **Email**: support@onchainmind.com

## 🌟 Star the Project

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ by the OnchainMind Team**

*Revolutionizing onchain identity with AI-powered NFTs on Circle Layer*
