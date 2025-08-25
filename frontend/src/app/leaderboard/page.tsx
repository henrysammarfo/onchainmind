'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';
import { apiClient, LeaderboardEntry } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      const leaderboardData = await apiClient.getLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Failed to load leaderboard:', error);
      setError('Failed to connect to backend. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return 'default';
      case 2:
        return 'secondary';
      case 3:
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
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
            <button onClick={loadLeaderboard} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reputation Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank among the OnchainMind community
          </p>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={entry.address}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        rank <= 3 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' 
                          : 'bg-muted/50 border-border hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center space-x-2">
                          {getRankIcon(rank)}
                          <Badge variant={getRankBadgeVariant(rank)}>
                            #{rank}
                          </Badge>
                        </div>

                        {/* User Info */}
                        <div>
                          <p className="font-semibold text-foreground">
                            {entry.name || `User ${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entry.address.slice(0, 10)}...{entry.address.slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {formatNumber(entry.score)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.level}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Rankings Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to build your reputation and claim the top spot!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(Math.max(...leaderboard.map(e => e.score)))}
                </p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length))}
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {leaderboard.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}