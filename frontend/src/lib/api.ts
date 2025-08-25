import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types based on your backend structure
export interface User {
  id: string;
  address: string;
  username?: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export interface AITwin {
  id: string;
  name: string;
  personality: string;
  traits: string[];
  reputation: number;
  createdAt: string;
  lastInteraction: string;
  activityScores: number[];
}

export interface ReputationData {
  score: number;
  level: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
  achievements: string[];
  transactionHistory: number[];
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  aiTwinId: string;
}

export interface LeaderboardEntry {
  address: string;
  score: number;
  level: number;
  name?: string;
}

export interface ContractInfo {
  ReputationScore: string;
  AIIdentity: string;
  AIRegistry: string;
}

export interface BlockchainStatus {
  network: string;
  chainId: number;
  blockNumber: number;
  gasPrice: string;
  isConnected: boolean;
  lastUpdated: string;
}

// API Client
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add user ID header for demo purposes
        const userId = this.getUserId();
        if (userId) {
          config.headers['x-user-id'] = userId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getUserId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_id') || 'demo-user';
    }
    return 'demo-user';
  }

  private setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', userId);
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Blockchain status
  async getBlockchainStatus(): Promise<BlockchainStatus> {
    const response = await this.client.get('/api/blockchain/status');
    return response.data;
  }

  async getContractAddresses(): Promise<ContractInfo> {
    const response = await this.client.get('/api/blockchain/contracts');
    return response.data;
  }

  // User management
  async getUserProfile(userId?: string): Promise<User> {
    const id = userId || this.getUserId();
    const response = await this.client.get(`/api/user/${id}`);
    return response.data;
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await this.client.put(`/api/user/${userId}`, data);
    return response.data;
  }

  // AI Twin management
  async getAITwin(userId?: string): Promise<AITwin> {
    const id = userId || this.getUserId();
    const response = await this.client.get(`/api/ai-twin/${id}`);
    return response.data;
  }

  async createAITwin(data: {
    name: string;
    personality: string;
    traits: string[];
    skills: string[];
  }): Promise<AITwin> {
    const response = await this.client.post('/api/ai-twin', data);
    return response.data;
  }

  async updateAITwin(id: string, data: Partial<AITwin>): Promise<void> {
    await this.client.put(`/api/ai-twin/${id}`, data);
  }

  // Reputation system
  async getReputationData(userId?: string): Promise<ReputationData> {
    const id = userId || this.getUserId();
    const response = await this.client.get(`/api/reputation/${id}`);
    return response.data;
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await this.client.get('/api/reputation/leaderboard');
    return response.data;
  }

  async awardReputation(userId: string, amount: number, reason: string): Promise<void> {
    await this.client.post('/api/reputation/award', { userId, amount, reason });
  }

  // Chat system
  async sendChatMessage(message: string, aiTwinId: string, userId?: string): Promise<{ response: string }> {
    const id = userId || this.getUserId();
    const response = await this.client.post('/api/chat', {
      message,
      aiTwinId,
      userId: id
    });
    return response.data;
  }

  async getChatHistory(userId?: string): Promise<ChatMessage[]> {
    const id = userId || this.getUserId();
    const response = await this.client.get(`/api/chat/${id}`);
    return response.data;
  }

  // Demo user setup
  async setupDemoUser(): Promise<string> {
    const userId = `user_${Date.now()}`;
    this.setUserId(userId);
    return userId;
  }

  // Check if connected
  async checkConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();