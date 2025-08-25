'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { ReputationCard } from '@/components/features/ReputationCard';
import { Trophy, TrendingUp, Award, Activity, BarChart3 } from 'lucide-react';
import { apiClient, ReputationData } from '@/lib/api';
import { formatNumber, formatTimeAgo } from '@/lib/utils';

export default function ReputationPage() {
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReputationData();
  }, []);

  const loadReputationData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Setup demo user if needed
      const userId = localStorage.getItem('user_id') || await apiClient.setupDemoUser();
      
      const reputationData = await apiClient.getReputationData(userId);
      setReputation(reputationData);
    } catch (error: any) {
      console.error('Failed to load reputation data:', error);
      setError('Failed to connect to backend. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your reputation data...</p>
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
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button onClick={loadReputationData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reputation Data</h3>
            <p className="text-muted-foreground">Start interacting to build your reputation!</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reputation System</h1>
          <p className="text-muted-foreground">
            Track your onchain reputation, achievements, and progress
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reputation Card */}
          <div className="lg:col-span-1">
            <ReputationCard reputation={reputation} />
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Score</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(reputation.score)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                      <p className="text-2xl font-bold text-foreground">
                        {reputation.level}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Reputation</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(reputation.totalEarned - reputation.totalSpent)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reputation.transactionHistory && reputation.transactionHistory.length > 0 ? (
                  <div className="space-y-3">
                    {reputation.transactionHistory.slice(-10).reverse().map((amount, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            amount > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {amount > 0 ? (
                              <TrendingUp className="w-4 h-4 text-white" />
                            ) : (
                              <Activity className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {amount > 0 ? 'Reputation Earned' : 'Reputation Spent'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(reputation.lastUpdated)}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {amount > 0 ? '+' : ''}{formatNumber(amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transaction history yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start interacting to see your reputation changes here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reputation.achievements && reputation.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reputation.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{achievement}</p>
                          <p className="text-xs text-muted-foreground">
                            Earned {formatTimeAgo(reputation.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No achievements yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete activities to unlock achievements
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}