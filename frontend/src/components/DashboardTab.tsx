import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Trophy, Zap, Plus, ArrowRight, Rocket } from 'lucide-react';
import AITwinCard from './AITwinCard';

function DashboardTab({ aiTwin, reputation, onMintAITwin, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-6 text-gray-400 text-lg">Creating your AI Twin...</p>
      </div>
    );
  }

  if (!aiTwin) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative mb-12"
        >
          <div className="w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Bot className="w-20 h-20 text-white" />
          </div>
          <div className="absolute inset-0 w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </motion.div>

        <h3 className="text-4xl font-bold text-white mb-6">
          Create Your AI Twin
        </h3>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Mint your unique AI Twin NFT to start earning reputation and interacting with the OnchainMind ecosystem. Your digital identity awaits.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMintAITwin}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transform transition-all duration-300"
        >
          <span className="flex items-center space-x-3">
            <Plus className="w-6 h-6" />
            <span>Mint AI Twin NFT</span>
            <ArrowRight className="w-6 h-6" />
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* AI Twin Card */}
      <div className="lg:col-span-2">
        <AITwinCard aiTwin={aiTwin} />
      </div>

      {/* Reputation & Stats */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
            Reputation Score
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              {reputation?.score || 0}
            </div>
            <div className="text-gray-400">
              Level {reputation?.level || 1}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="w-6 h-6 text-blue-400 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Chat with AI Twin
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              View Leaderboard
            </button>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
