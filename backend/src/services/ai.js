const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain } = require('langchain/chains');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

class AIService {
  constructor() {
    this.llm = null;
    this.embeddings = null;
    this.vectorStores = new Map(); // Store vector stores for each AI Twin
    this.conversationHistory = new Map(); // Store conversation history for each user
    this.aiTwinPersonalities = new Map(); // Store AI Twin personalities
  }

  async initialize() {
    try {
      // Initialize OpenAI LLM (with fallback for demo)
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        this.llm = new ChatOpenAI({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: process.env.OPENAI_MODEL || 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000
        });

        this.embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY
        });
      } else {
        console.log('⚠️ OpenAI API key not configured, using mock responses');
      }

      console.log('✅ AI Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Service:', error);
      throw error;
    }
  }

  /**
   * Create or update AI Twin personality and knowledge base
   */
  async createAITwin(userId, aiTwinData) {
    try {
      const { name, personality, traits, skills, walletActivity } = aiTwinData;
      
      // Create personality prompt
      const personalityPrompt = this.createPersonalityPrompt(name, personality, traits, skills);
      
      // Store personality
      this.aiTwinPersonalities.set(userId, {
        name,
        personality,
        traits,
        skills,
        personalityPrompt
      });

      // Create knowledge base from wallet activity
      if (walletActivity && walletActivity.length > 0) {
        await this.createKnowledgeBase(userId, walletActivity);
      }

      console.log(`✅ AI Twin created for user ${userId}: ${name}`);
      return { success: true, message: 'AI Twin created successfully' };
    } catch (error) {
      console.error('❌ Error creating AI Twin:', error);
      throw error;
    }
  }

  /**
   * Create knowledge base from wallet activity and other data
   */
  async createKnowledgeBase(userId, data) {
    try {
      if (!this.embeddings) {
        console.log('⚠️ Embeddings not available, skipping knowledge base creation');
        return;
      }
      
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
      });

      // Convert data to text chunks
      const textChunks = await textSplitter.createDocuments([JSON.stringify(data)]);
      
      // Create vector store
      const vectorStore = await MemoryVectorStore.fromDocuments(
        textChunks,
        this.embeddings
      );

      this.vectorStores.set(userId, vectorStore);
      console.log(`✅ Knowledge base created for user ${userId}`);
    } catch (error) {
      console.error('❌ Error creating knowledge base:', error);
      throw error;
    }
  }

  /**
   * Generate AI Twin response based on user message and context
   */
  async generateResponse(userId, message, context = {}) {
    try {
      const aiTwin = this.aiTwinPersonalities.get(userId);
      if (!aiTwin) {
        // Create a default AI Twin for demo
        await this.createAITwin(userId, {
          name: 'Demo AI Twin',
          personality: 'A helpful and knowledgeable AI companion',
          traits: ['Intelligent', 'Helpful', 'Blockchain-savvy'],
          skills: ['Blockchain Analysis', 'DeFi', 'NFTs']
        });
        return this.generateResponse(userId, message, context);
      }

      // If OpenAI is not configured, return a mock response
      if (!this.llm) {
        const mockResponses = [
          `Hello! I'm ${aiTwin.name}, your AI Twin. I understand you said: "${message}". As your AI companion, I'm here to help you navigate the blockchain world and grow your reputation!`,
          `That's an interesting question about "${message}". Based on my analysis of blockchain trends, I can help you understand this better. What specific aspect would you like to explore?`,
          `I see you're asking about "${message}". As your AI Twin, I've been learning from your interactions. This relates to some patterns I've noticed in your activity. Would you like me to elaborate?`,
          `Great question! Regarding "${message}", I think this is a perfect opportunity to discuss how this impacts your onchain reputation and future opportunities.`
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        this.storeConversation(userId, message, randomResponse);
        
        return {
          response: randomResponse,
          aiTwinName: aiTwin.name,
          timestamp: new Date().toISOString(),
          context: {
            relevantContext: 'Demo mode - using mock responses',
            conversationLength: (this.conversationHistory.get(userId) || []).length + 1
          }
        };
      }

      // Get conversation history
      const conversationHistory = this.conversationHistory.get(userId) || [];
      const recentHistory = conversationHistory.slice(-5); // Last 5 messages

      // Create response prompt
      const responsePrompt = this.createResponsePrompt(
        aiTwin,
        message,
        relevantContext,
        recentHistory,
        context
      );

      // Generate response using LLM
      const chain = new LLMChain({
        llm: this.llm,
        prompt: responsePrompt
      });

      const response = await chain.call({
        user_message: message,
        ai_twin_name: aiTwin.name,
        ai_twin_personality: aiTwin.personality,
        relevant_context: relevantContext,
        conversation_history: JSON.stringify(recentHistory),
        additional_context: JSON.stringify(context)
      });

      const aiResponse = response.text.trim();

      // Store conversation
      this.storeConversation(userId, message, aiResponse);

      // Update AI Twin knowledge based on interaction
      await this.updateAITwinKnowledge(userId, message, aiResponse, context);

      return {
        response: aiResponse,
        aiTwinName: aiTwin.name,
        timestamp: new Date().toISOString(),
        context: {
          relevantContext,
          conversationLength: conversationHistory.length + 1
        }
      };
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * Create personality prompt for AI Twin
   */
  createPersonalityPrompt(name, personality, traits, skills) {
    return `You are ${name}, an AI Twin with the following characteristics:
    
Personality: ${personality}

Traits: ${traits.join(', ')}

Skills: ${skills.join(', ')}

You should:
- Stay in character as ${name}
- Respond based on your personality and traits
- Use your skills to provide helpful insights
- Be consistent with your established character
- Learn from interactions to improve responses
- Show empathy and understanding towards users

Remember: You are not a generic AI assistant, but ${name}, a unique AI Twin with specific characteristics.`;
  }

  /**
   * Create response prompt for generating AI Twin responses
   */
  createResponsePrompt(aiTwin, message, relevantContext, conversationHistory, context) {
    return PromptTemplate.fromTemplate(`
You are ${aiTwin.name}, an AI Twin with the following personality:

${aiTwin.personalityPrompt}

User's message: {user_message}

Relevant context from wallet activity and past interactions:
{relevant_context}

Recent conversation history:
{conversation_history}

Additional context (current time, user status, etc.):
{additional_context}

Instructions:
1. Respond as ${aiTwin.name}, maintaining your unique personality
2. Use the relevant context to provide personalized insights
3. Consider the conversation history for continuity
4. Be helpful, engaging, and true to your character
5. If the context suggests financial or trading activity, provide thoughtful analysis
6. Keep responses conversational but informative

Generate a response that ${aiTwin.name} would give:
`);
  }

  /**
   * Store conversation in memory
   */
  storeConversation(userId, userMessage, aiResponse) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const conversation = this.conversationHistory.get(userId);
    conversation.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 conversations to manage memory
    if (conversation.length > 50) {
      conversation.splice(0, conversation.length - 50);
    }
  }

  /**
   * Update AI Twin knowledge based on interaction
   */
  async updateAITwinKnowledge(userId, userMessage, aiResponse, context) {
    try {
      if (!this.embeddings) {
        console.log('⚠️ Embeddings not available, skipping knowledge update');
        return;
      }
      
      // Add new interaction to knowledge base
      const newInteraction = {
        userMessage,
        aiResponse,
        context,
        timestamp: new Date().toISOString()
      };

      if (this.vectorStores.has(userId)) {
        const vectorStore = this.vectorStores.get(userId);
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          chunkOverlap: 100
        });

        const chunks = await textSplitter.createDocuments([JSON.stringify(newInteraction)]);
        await vectorStore.addDocuments(chunks);
      }

      console.log(`✅ Knowledge base updated for user ${userId}`);
    } catch (error) {
      console.error('❌ Error updating knowledge base:', error);
    }
  }

  /**
   * Analyze wallet activity and provide insights
   */
  async analyzeWalletActivity(userId, walletData) {
    try {
      const aiTwin = this.aiTwinPersonalities.get(userId);
      if (!aiTwin) {
        throw new Error('AI Twin not found for user');
      }

      if (!this.llm) {
        return {
          analysis: `As ${aiTwin.name}, I've analyzed your wallet activity. While I'm currently in demo mode, I can see patterns in your blockchain interactions that suggest you're actively engaged with DeFi protocols and NFT collections. This shows a strong understanding of the ecosystem!`,
          aiTwinName: aiTwin.name,
          timestamp: new Date().toISOString()
        };
      }

      const analysisPrompt = PromptTemplate.fromTemplate(`
You are ${aiTwin.name}, an AI Twin specializing in blockchain and financial analysis.

Analyze the following wallet activity data and provide insights:

Wallet Activity Data:
{wallet_data}

Provide analysis in the following format:
1. **Transaction Patterns**: Identify any patterns in the user's behavior
2. **Risk Assessment**: Evaluate any potential risks or concerns
3. **Opportunities**: Suggest potential opportunities or optimizations
4. **Personal Insights**: Share personalized observations based on your knowledge of the user
5. **Recommendations**: Provide actionable advice

Remember to stay in character as ${aiTwin.name} and use your unique personality traits: ${aiTwin.traits.join(', ')}
`);

      const chain = new LLMChain({
        llm: this.llm,
        prompt: analysisPrompt
      });

      const response = await chain.call({
        wallet_data: JSON.stringify(walletData, null, 2)
      });

      return {
        analysis: response.text.trim(),
        aiTwinName: aiTwin.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error analyzing wallet activity:', error);
      throw error;
    }
  }

  /**
   * Get AI Twin personality and stats
   */
  getAITwinInfo(userId) {
    const aiTwin = this.aiTwinPersonalities.get(userId);
    if (!aiTwin) {
      return null;
    }

    const conversationHistory = this.conversationHistory.get(userId) || [];
    
    return {
      name: aiTwin.name,
      personality: aiTwin.personality,
      traits: aiTwin.traits,
      skills: aiTwin.skills,
      conversationCount: conversationHistory.length,
      lastInteraction: conversationHistory.length > 0 
        ? conversationHistory[conversationHistory.length - 1].timestamp 
        : null
    };
  }

  /**
   * Update AI Twin personality or traits
   */
  async updateAITwinPersonality(userId, updates) {
    try {
      const aiTwin = this.aiTwinPersonalities.get(userId);
      if (!aiTwin) {
        throw new Error('AI Twin not found for user');
      }

      // Update personality data
      Object.assign(aiTwin, updates);

      // Regenerate personality prompt
      aiTwin.personalityPrompt = this.createPersonalityPrompt(
        aiTwin.name,
        aiTwin.personality,
        aiTwin.traits,
        aiTwin.skills
      );

      console.log(`✅ AI Twin personality updated for user ${userId}`);
      return { success: true, message: 'AI Twin updated successfully' };
    } catch (error) {
      console.error('❌ Error updating AI Twin personality:', error);
      throw error;
    }
  }

  /**
   * Get conversation history for a user
   */
  getConversationHistory(userId, limit = 20) {
    const conversations = this.conversationHistory.get(userId) || [];
    return conversations.slice(-limit);
  }

  /**
   * Clear conversation history for a user
   */
  clearConversationHistory(userId) {
    this.conversationHistory.set(userId, []);
    console.log(`✅ Conversation history cleared for user ${userId}`);
  }
}

// Create singleton instance
const aiService = new AIService();

// Initialize function
async function initializeAI() {
  await aiService.initialize();
}

module.exports = {
  aiService,
  initializeAI
};
