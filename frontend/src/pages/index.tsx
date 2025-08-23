import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Wallet, Bot, Trophy, MessageCircle, Settings, User, Sparkles } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import AITwinCard from '../components/AITwinCard';
import ChatInterface from '../components/ChatInterface';
import ReputationLeaderboard from '../components/ReputationLeaderboard';
import NetworkStatus from '../components/NetworkStatus';
import { useWallet } from '../hooks/useWallet';
import { useAITwin } from '../hooks/useAITwin';
import { useReputation } from '../hooks/useReputation';

export default function Home() {
  const { isConnected, address, chainId } = useWallet();
  const { aiTwin, mintAITwin, isLoading: aiTwinLoading } = useAITwin();
  const { reputation, updateReputation } = useReputation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMintModal, setShowMintModal] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMintAITwin = async (aiTwinData: any) => {
    try {
      await mintAITwin(aiTwinData);
      setShowMintModal(false);
    } catch (error) {
      console.error('Failed to mint AI Twin:', error);
    }
  };

  return (
    <>
      <Head>
        <title>OnchainMind - AI-powered Onchain Identity & SocialFi dApp</title>
        <meta name="description" content="Build your AI Twin NFT and earn reputation on Circle Layer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
        {/* Header */}
        <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  OnchainMind
                </h1>
              </motion.div>

              <div className="flex items-center space-x-4">
                <NetworkStatus />
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to OnchainMind
                </h2>
                <p className="text-dark-300 mb-8">
                  Connect your wallet to create your AI Twin NFT and start earning reputation on Circle Layer
                </p>
                <WalletConnect />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-1 bg-dark-800 rounded-xl p-1 mb-8"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-dark-300 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </motion.nav>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    aiTwin={aiTwin}
                    reputation={reputation}
                    onMintAITwin={() => setShowMintModal(true)}
                    isLoading={aiTwinLoading}
                  />
                )}

                {activeTab === 'chat' && (
                  <ChatTab aiTwin={aiTwin} />
                )}

                {activeTab === 'leaderboard' && (
                  <LeaderboardTab />
                )}

                {activeTab === 'profile' && (
                  <ProfileTab aiTwin={aiTwin} reputation={reputation} />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab />
                )}
              </motion.div>
            </>
          )}
        </main>

        {/* Mint AI Twin Modal */}
        {showMintModal && (
          <MintAITwinModal
            onClose={() => setShowMintModal(false)}
            onMint={handleMintAITwin}
          />
        )}
      </div>
    </>
  );
}

// Dashboard Tab Component
function DashboardTab({ aiTwin, reputation, onMintAITwin, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-dark-300">Loading your AI Twin...</p>
      </div>
    );
  }

  if (!aiTwin) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Bot className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Create Your AI Twin
        </h3>
        <p className="text-dark-300 mb-8 max-w-md mx-auto">
          Mint your unique AI Twin NFT to start earning reputation and interacting with the OnchainMind ecosystem
        </p>
        <button
          onClick={onMintAITwin}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Mint AI Twin NFT
        </button>
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
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Reputation Score</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">
              {reputation?.score || 0}
            </div>
            <div className="text-sm text-dark-300">
              Level {reputation?.level || 1}
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              Chat with AI Twin
            </button>
            <button className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg transition-colors">
              View Leaderboard
            </button>
            <button className="w-full bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Tab Component
function ChatTab({ aiTwin }) {
  if (!aiTwin) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-300">Please create an AI Twin first to start chatting</p>
      </div>
    );
  }

  return <ChatInterface aiTwin={aiTwin} />;
}

// Leaderboard Tab Component
function LeaderboardTab() {
  return <ReputationLeaderboard />;
}

// Profile Tab Component
function ProfileTab({ aiTwin, reputation }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-white mb-6">Profile Settings</h3>
        {/* Profile content */}
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-white mb-6">Settings</h3>
        {/* Settings content */}
      </div>
    </div>
  );
}

// Mint AI Twin Modal Component
function MintAITwinModal({ onClose, onMint }) {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-dark-700">
        <h3 className="text-xl font-semibold text-white mb-6">Create Your AI Twin</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              AI Twin Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter AI Twin name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Personality
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your AI Twin's personality"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Traits
            </label>
            {formData.traits.map((trait, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={trait}
                  onChange={(e) => updateField('traits', index, e.target.value)}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter trait"
                />
                {formData.traits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('traits', index)}
                    className="px-3 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('traits')}
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              + Add Trait
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Skills
            </label>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateField('skills', index, e.target.value)}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter skill"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('skills', index)}
                    className="px-3 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('skills')}
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              + Add Skill
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Mint AI Twin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
