import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useReputation } from '../hooks/useReputation';

interface LeaderboardEntry {
  address: string;
  score: number;
  level: number;
  name: string;
}

const ReputationLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLeaderboard } = useReputation();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-dark-400 font-bold">#{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-dark-600 to-dark-700';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-dark-300">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Reputation Leaderboard</h2>
          <p className="text-dark-300">Top performers in the OnchainMind ecosystem</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.name === 'You';
          
          return (
            <motion.div
              key={entry.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-primary-500/50' 
                  : 'bg-dark-700/50 border-dark-600 hover:border-dark-500'
              }`}
            >
              {/* Rank gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(rank)} opacity-10`} />
              
              <div className="relative p-4 flex items-center space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(rank)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold truncate ${
                      isCurrentUser ? 'text-primary-300' : 'text-white'
                    }`}>
                      {entry.name}
                    </h3>
                    {isCurrentUser && (
                      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-400 truncate">
                    {formatAddress(entry.address)}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right">
                  <div className={`text-lg font-bold ${
                    isCurrentUser ? 'text-primary-300' : 'text-white'
                  }`}>
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-dark-400">
                    Level {entry.level}
                  </div>
                </div>

                {/* Rank badge for top 3 */}
                {rank <= 3 && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">#{rank}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm text-dark-400">
          <span>Updated every 5 minutes</span>
          <button 
            onClick={loadLeaderboard}
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReputationLeaderboard;
