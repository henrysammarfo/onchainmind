import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private url: string;
  private userId: string | null = null;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
  }

  connect(userId: string): void {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.userId = userId;
    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      if (this.userId) {
        this.socket?.emit('join-user-room', this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendChatMessage(message: string, aiTwinId: string): void {
    if (this.socket && this.userId) {
      this.socket.emit('chat-message', {
        userId: this.userId,
        message,
        aiTwinId
      });
    }
  }

  onAIResponse(callback: (data: { message: string; timestamp: string; aiTwinId: string }) => void): void {
    if (this.socket) {
      this.socket.on('ai-response', callback);
    }
  }

  onReputationUpdate(callback: (data: { newReputation: number; reason: string; timestamp: string }) => void): void {
    if (this.socket) {
      this.socket.on('reputation-changed', callback);
    }
  }

  offAIResponse(): void {
    if (this.socket) {
      this.socket.off('ai-response');
    }
  }

  offReputationUpdate(): void {
    if (this.socket) {
      this.socket.off('reputation-changed');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();