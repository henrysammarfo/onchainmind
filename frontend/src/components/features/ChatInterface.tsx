'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { Send, Bot, User } from 'lucide-react';
import { apiClient, ChatMessage } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { formatTimeAgo } from '@/lib/utils';

interface ChatInterfaceProps {
  aiTwinId: string;
  aiTwinName: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export function ChatInterface({ aiTwinId, aiTwinName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const userId = localStorage.getItem('user_id') || 'demo-user';
    wsClient.connect(userId);
    setIsConnected(wsClient.isConnected());

    // Listen for AI responses
    wsClient.onAIResponse((data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: data.message,
        timestamp: data.timestamp
      }]);
      setIsLoading(false);
    });

    // Load chat history
    loadChatHistory();

    return () => {
      wsClient.offAIResponse();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const history = await apiClient.getChatHistory();
      const formattedMessages: Message[] = [];
      
      history.forEach(chat => {
        formattedMessages.push({
          id: `${chat.id}-user`,
          type: 'user',
          content: chat.message,
          timestamp: chat.timestamp
        });
        formattedMessages.push({
          id: `${chat.id}-ai`,
          type: 'ai',
          content: chat.response,
          timestamp: chat.timestamp
        });
      });
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const messageToSend = inputMessage;
    setInputMessage('');

    try {
      if (wsClient.isConnected()) {
        // Use WebSocket for real-time response
        wsClient.sendChatMessage(messageToSend, aiTwinId);
      } else {
        // Fallback to HTTP API
        const response = await apiClient.sendChatMessage(messageToSend, aiTwinId);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.response,
          timestamp: new Date().toISOString()
        }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <span>Chat with {aiTwinName}</span>
          {isConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Connected" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Start a conversation with your AI Twin!</p>
              <p className="text-sm mt-2">Ask about blockchain trends, get insights, or just chat.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTimeAgo(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">AI Twin is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}