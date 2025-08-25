'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { AITwinCard } from '@/components/features/AITwinCard';
import { CreateAITwinForm } from '@/components/features/CreateAITwinForm';
import { ChatInterface } from '@/components/features/ChatInterface';
import { Bot, Plus, MessageCircle } from 'lucide-react';
import { apiClient, AITwin } from '@/lib/api';

export default function AITwinsPage() {
  const [aiTwin, setAiTwin] = useState<AITwin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAITwin();
  }, []);

  const loadAITwin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Setup demo user if needed
      const userId = localStorage.getItem('user_id') || await apiClient.setupDemoUser();
      
      const aiTwinData = await apiClient.getAITwin(userId);
      setAiTwin(aiTwinData);
    } catch (error: any) {
      console.error('Failed to load AI Twin:', error);
      if (error.response?.status === 404) {
        // No AI Twin found, show create form
        setAiTwin(null);
      } else {
        setError('Failed to connect to backend. Please check if the server is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadAITwin();
  };

  const handleChatWithAI = () => {
    setShowChat(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your AI Twin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadAITwin}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Twins</h1>
              <p className="text-muted-foreground">
                Create and manage your AI-powered digital identity
              </p>
            </div>
            {aiTwin && !showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Twin
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {showCreateForm ? (
          <CreateAITwinForm 
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : aiTwin ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Twin Card */}
            <div className="lg:col-span-1">
              <AITwinCard 
                aiTwin={aiTwin} 
                onChat={handleChatWithAI}
              />
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              {showChat ? (
                <ChatInterface 
                  aiTwinId={aiTwin.id} 
                  aiTwinName={aiTwin.name}
                />
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Chat</h3>
                    <p className="text-muted-foreground mb-4">
                      Start a conversation with your AI Twin to see it in action
                    </p>
                    <Button onClick={handleChatWithAI}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chatting
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Create Your First AI Twin</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  AI Twins are unique digital identities that learn from your interactions and help you build your onchain reputation. 
                  Each AI Twin has its own personality, traits, and capabilities.
                </p>
                <Button size="lg" onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create AI Twin
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}