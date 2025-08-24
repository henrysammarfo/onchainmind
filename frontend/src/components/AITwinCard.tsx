import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Star, Clock, TrendingUp } from 'lucide-react';

interface AITwin {
  id: string;
  name: string;
  personality: string;
  traits: string[];
  reputation: number;
  createdAt: string;
  lastInteraction: string;
  activityScores: number[];
}

interface AITwinCardProps {
  aiTwin: AITwin;
}

const AITwinCard: React.FC<AITwinCardProps> = ({ aiTwin }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAverageActivityScore = () => {
    if (!aiTwin.activityScores || aiTwin.activityScores.length === 0) return 0;
    return aiTwin.activityScores.reduce((sum, score) => sum + score, 0) / aiTwin.activityScores.length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 border border-dark-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{aiTwin.name}</h2>
          <p className="text-dark-300">AI Twin #{aiTwin.id}</p>
        </div>
      </div>

      {/* Personality */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Personality</h3>
        <p className="text-dark-300 leading-relaxed">{aiTwin.personality}</p>
      </div>

      {/* Traits */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Traits</h3>
        <div className="flex flex-wrap gap-2">
          {aiTwin.traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{aiTwin.reputation}</div>
          <div className="text-xs text-dark-300">Reputation</div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{formatDate(aiTwin.createdAt)}</div>
          <div className="text-xs text-dark-300">Created</div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{getAverageActivityScore().toFixed(1)}</div>
          <div className="text-xs text-dark-300">Avg Score</div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <Bot className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{formatDate(aiTwin.lastInteraction)}</div>
          <div className="text-xs text-dark-300">Last Active</div>
        </div>
      </div>

      {/* Activity Chart */}
      {aiTwin.activityScores && aiTwin.activityScores.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Activity History</h3>
          <div className="flex items-end space-x-1 h-20">
            {aiTwin.activityScores.slice(-10).map((score, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${(score / Math.max(...aiTwin.activityScores)) * 100}%` }}
                title={`Score: ${score}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AITwinCard;
