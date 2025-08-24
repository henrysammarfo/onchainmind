import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, Settings, Globe, Bot, Plus, Rocket, XCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';
import ReputationLeaderboard from './ReputationLeaderboard';

// Chat Tab Component
export function ChatTab({ aiTwin }) {
  if (!aiTwin) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <MessageCircle className="w-16 h-16 text-white" />
        </div>
        <p className="text-xl text-gray-400">Please create an AI Twin first to start chatting</p>
      </div>
    );
  }

  return <ChatInterface aiTwin={aiTwin} />;
}

// Leaderboard Tab Component
export function LeaderboardTab() {
  return <ReputationLeaderboard />;
}

// Profile Tab Component
export function ProfileTab({ aiTwin, reputation }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
          <User className="w-8 h-8 text-blue-400 mr-3" />
          Profile Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">AI Twin Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Active</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Network</h4>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Circle Layer Testnet</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Reputation</h4>
              <div className="text-2xl font-bold text-yellow-400">{reputation?.score || 0}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">Level</h4>
              <div className="text-2xl font-bold text-purple-400">{reputation?.level || 1}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
export function SettingsTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
          <Settings className="w-8 h-8 text-gray-400 mr-3" />
          Settings
        </h3>
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Theme</h4>
            <p className="text-gray-400">Dark mode (default)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Notifications</h4>
            <p className="text-gray-400">Enabled</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Privacy</h4>
            <p className="text-gray-400">Public profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mint AI Twin Modal Component
export function MintAITwinModal({ onClose, onMint, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    personality: '',
    traits: [''],
    skills: ['']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onMint(formData);
  };

  const addField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#1a1a2e] rounded-3xl p-8 max-w-2xl w-full mx-4 border border-white/10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white flex items-center">
            <Bot className="w-8 h-8 text-blue-400 mr-3" />
            Create Your AI Twin
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-white mb-3">
              AI Twin Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter AI Twin name"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-3">
              Personality
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
              placeholder="Describe your AI Twin's personality"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-3">
              Traits
            </label>
            {formData.traits.map((trait, index) => (
              <div key={index} className="flex space-x-3 mb-3">
                <input
                  type="text"
                  value={trait}
                  onChange={(e) => updateField('traits', index, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter trait"
                />
                {formData.traits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('traits', index)}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('traits')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trait</span>
            </button>
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-3">
              Skills
            </label>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex space-x-3 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateField('skills', index, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter skill"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('skills', index)}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('skills')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl transition-colors text-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Minting...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Mint AI Twin</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
