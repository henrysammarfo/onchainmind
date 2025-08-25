'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { AITwinCard } from '@/components/features/AITwinCard';
import { ReputationCard } from '@/components/features/ReputationCard';
import { ChatInterface } from '@/components/features/ChatInterface';
import { 
  Bot, 
  Trophy, 
  Activity, 
  TrendingUp,
  MessageCircle,
  Plus,
  Zap
} from 'lucide-react';
import { apiClient, AITwin, ReputationData, User } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [aiTwin, setAiTwin] = useState<AITwin | null>(null);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Setup demo user if needed
      const userId = localStorage.getItem('user_id') || await apiClient.setupDemoUser();

      // Load all dashboard data
      const [userData, aiTwinData, reputationData] = await Promise.all([
        apiClient.getUserProfile(userId).catch(() => null),
        apiClient.getAITwin(userId).catch(() => null),
        apiClient.getReputationData(userId).catch(() => null)
      ]);

      setUser(userData);
      setAiTwin(aiTwinData);
      setReputation(reputationData);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to connect to backend. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAITwin = () => {
    // Navigate to AI Twin creation
    window.location.href = '/ai-twins';
  };

  const handleChatWithAI = () => {
    setShowChat(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
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
              <Activity className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadDashboardData}>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to OnchainMind! 👋
          </h1>
          <p className="text-muted-foreground">
            Your AI-powered onchain identity dashboard is ready to explore.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reputation Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {reputation?.score || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Level {reputation?.level || 1}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Twin Status</p>
                  <p className="text-2xl font-bold text-foreground">
                    {aiTwin ? 'Active' : 'None'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Activity className="w-4 h-4 mr-1" />
                <span>{aiTwin ? 'Ready to chat' : 'Create your first AI Twin'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(reputation?.totalEarned || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 mr-1" />
                <span>Reputation points</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold text-foreground">
                    {reputation?.achievements?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Activity className="w-4 h-4 mr-1" />
                <span>Badges earned</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - AI Twin & Reputation */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Twin Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your AI Twin</h2>
                {!aiTwin && (
                  <Button onClick={handleCreateAITwin}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create AI Twin
                  </Button>
                )}
              </div>
              
              {aiTwin ? (
                <AITwinCard 
                  aiTwin={aiTwin} 
                  onChat={handleChatWithAI}
                  onManage={() => window.location.href = '/ai-twins'}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No AI Twin yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first AI Twin to start building your onchain identity
                    </p>
                    <Button onClick={handleCreateAITwin}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create AI Twin
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Chat Interface */}
            {showChat && aiTwin && (
              <ChatInterface 
                aiTwinId={aiTwin.id} 
                aiTwinName={aiTwin.name}
              />
            )}
          </div>

          {/* Right Column - Reputation & Quick Actions */}
          <div className="space-y-8">
            {/* Reputation Card */}
            {reputation && <ReputationCard reputation={reputation} />}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiTwin && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleChatWithAI}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with AI Twin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/reputation'}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Reputation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/leaderboard'}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/ai-twins'}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Manage AI Twins
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Welcome bonus earned</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                    <span className="text-sm font-medium text-green-500">+100 XP</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Dashboard accessed</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}