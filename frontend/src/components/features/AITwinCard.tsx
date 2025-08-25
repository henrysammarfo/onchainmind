'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bot, MessageCircle, TrendingUp, Star } from 'lucide-react';
import { AITwin } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';

interface AITwinCardProps {
  aiTwin: AITwin;
  onChat?: () => void;
  onManage?: () => void;
}

export function AITwinCard({ aiTwin, onChat, onManage }: AITwinCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{aiTwin.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{aiTwin.personality}</p>
            </div>
          </div>
          <Badge variant="secondary">
            <Star className="w-3 h-3 mr-1" />
            {aiTwin.reputation}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Traits */}
        <div>
          <p className="text-sm font-medium mb-2">Traits</p>
          <div className="flex flex-wrap gap-1">
            {aiTwin.traits.map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Activity Scores */}
        {aiTwin.activityScores && aiTwin.activityScores.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Recent Activity</p>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Latest score: {aiTwin.activityScores[aiTwin.activityScores.length - 1]}
              </span>
            </div>
          </div>
        )}

        {/* Last Interaction */}
        <div className="text-xs text-muted-foreground">
          Last interaction: {formatTimeAgo(aiTwin.lastInteraction)}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {onChat && (
            <Button size="sm" onClick={onChat} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}
          {onManage && (
            <Button size="sm" variant="outline" onClick={onManage}>
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}