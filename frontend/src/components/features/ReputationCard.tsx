'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, TrendingUp, Award, Activity } from 'lucide-react';
import { ReputationData } from '@/lib/api';
import { formatNumber, formatTimeAgo } from '@/lib/utils';

interface ReputationCardProps {
  reputation: ReputationData;
}

export function ReputationCard({ reputation }: ReputationCardProps) {
  const progressPercentage = Math.min((reputation.score / 1000) * 100, 100);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Reputation Score</span>
          </CardTitle>
          <Badge variant="secondary">Level {reputation.level}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {formatNumber(reputation.score)}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Progress to next level
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold">{formatNumber(reputation.totalEarned)}</div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold">{formatNumber(reputation.totalSpent)}</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
        </div>

        {/* Achievements */}
        {reputation.achievements && reputation.achievements.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Achievements</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {reputation.achievements.map((achievement, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {formatTimeAgo(reputation.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
}