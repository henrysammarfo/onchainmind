'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Circle, AITwin, ReputationScore } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Users, 
  Trophy, 
  Bot, 
  TrendingUp, 
  Activity,
  Circle as CircleIcon,
  Star,
  ArrowRight
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [aiTwins, setAiTwins] = useState<AITwin[]>([]);
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [circlesData, twinsData, reputationData] = await Promise.all([
        apiClient.getCircles(1, 5),
        apiClient.getAITwins(),
        apiClient.getReputationScore(user!.id)
      ]);
      
      setCircles(circlesData.data);
      setAiTwins(twinsData);
      setReputation(reputationData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your onchain identity today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
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
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Twins</p>
                <p className="text-2xl font-bold text-foreground">
                  {aiTwins.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              <span>Active twins</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Circles Joined</p>
                <p className="text-2xl font-bold text-foreground">
                  {circles.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <CircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-1" />
              <span>Communities</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold text-foreground">
                  {reputation?.badges?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 mr-1" />
              <span>Achievements</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Twin Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">AI Twin Status</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </div>
              
              {aiTwins.length > 0 ? (
                <div className="space-y-4">
                  {aiTwins.map((twin) => (
                    <div key={twin.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{twin.name}</h3>
                        <p className="text-sm text-muted-foreground">{twin.personality}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Level {twin.level}</span>
                          <span>XP: {twin.experience}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No AI Twins yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI Twin to start building your onchain identity
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create AI Twin
                  </Button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Earned reputation points</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <span className="text-sm font-medium text-green-500">+25 XP</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CircleIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Joined new circle</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <span className="text-sm font-medium text-blue-500">Developer Hub</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Earned new badge</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                  <span className="text-sm font-medium text-purple-500">Early Adopter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Circles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  Chat with AI Twin
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Feed
                </Button>
              </div>
            </div>

            {/* Recent Circles */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Circles</h2>
              {circles.length > 0 ? (
                <div className="space-y-3">
                  {circles.slice(0, 3).map((circle) => (
                    <div key={circle.id} className="p-3 bg-muted/50 rounded-lg">
                      <h3 className="font-medium text-foreground text-sm">{circle.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {circle.members.length} members
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Circles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No circles joined yet</p>
                  <Button size="sm">
                    <CircleIcon className="w-4 h-4 mr-2" />
                    Explore Circles
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
