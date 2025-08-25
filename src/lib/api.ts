import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  level: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  maxMembers: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AITwin {
  id: string;
  userId: string;
  name: string;
  personality: string;
  avatar: string;
  level: number;
  experience: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReputationScore {
  userId: string;
  score: number;
  level: number;
  badges: string[];
  lastUpdated: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Client
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            return this.client.request(error.config);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data;
      this.setAuthToken(token);
      return true;
    } catch {
      this.removeAuthToken();
      return false;
    }
  }

  // Authentication
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/signin', {
      email,
      password,
    });
    
    this.setAuthToken(response.data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    
    return response.data;
  }

  async signUp(username: string, email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/signup', {
      username,
      email,
      password,
    });
    
    this.setAuthToken(response.data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    
    return response.data;
  }

  async signOut(): Promise<void> {
    try {
      await this.client.post('/auth/signout');
    } finally {
      this.removeAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/me');
    return response.data;
  }

  // User management
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.client.put(`/users/${userId}`, data);
    return response.data;
  }

  async getUserProfile(userId: string): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  // Circles
  async createCircle(data: Omit<Circle, 'id' | 'ownerId' | 'members' | 'createdAt' | 'updatedAt'>): Promise<Circle> {
    const response: AxiosResponse<Circle> = await this.client.post('/circles', data);
    return response.data;
  }

  async getCircles(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Circle>> {
    const response: AxiosResponse<PaginatedResponse<Circle>> = await this.client.get('/circles', {
      params: { page, limit },
    });
    return response.data;
  }

  async getCircle(circleId: string): Promise<Circle> {
    const response: AxiosResponse<Circle> = await this.client.get(`/circles/${circleId}`);
    return response.data;
  }

  async updateCircle(circleId: string, data: Partial<Circle>): Promise<Circle> {
    const response: AxiosResponse<Circle> = await this.client.put(`/circles/${circleId}`, data);
    return response.data;
  }

  async deleteCircle(circleId: string): Promise<void> {
    await this.client.delete(`/circles/${circleId}`);
  }

  async joinCircle(circleId: string): Promise<void> {
    await this.client.post(`/circles/${circleId}/join`);
  }

  async leaveCircle(circleId: string): Promise<void> {
    await this.client.post(`/circles/${circleId}/leave`);
  }

  // AI Twins
  async createAITwin(data: Omit<AITwin, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<AITwin> {
    const response: AxiosResponse<AITwin> = await this.client.post('/ai-twins', data);
    return response.data;
  }

  async getAITwins(): Promise<AITwin[]> {
    const response: AxiosResponse<AITwin[]> = await this.client.get('/ai-twins');
    return response.data;
  }

  async getAITwin(twinId: string): Promise<AITwin> {
    const response: AxiosResponse<AITwin> = await this.client.get(`/ai-twins/${twinId}`);
    return response.data;
  }

  async updateAITwin(twinId: string, data: Partial<AITwin>): Promise<AITwin> {
    const response: AxiosResponse<AITwin> = await this.client.put(`/ai-twins/${twinId}`, data);
    return response.data;
  }

  async deleteAITwin(twinId: string): Promise<void> {
    await this.client.delete(`/ai-twins/${twinId}`);
  }

  // Reputation
  async getReputationScore(userId: string): Promise<ReputationScore> {
    const response: AxiosResponse<ReputationScore> = await this.client.get(`/reputation/${userId}`);
    return response.data;
  }

  async getLeaderboard(page: number = 1, limit: number = 20): Promise<PaginatedResponse<ReputationScore>> {
    const response: AxiosResponse<PaginatedResponse<ReputationScore>> = await this.client.get('/reputation/leaderboard', {
      params: { page, limit },
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { User, Circle, AITwin, ReputationScore, AuthResponse, ApiResponse, PaginatedResponse };
