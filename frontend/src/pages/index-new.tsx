import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Bot, Trophy, MessageCircle, Settings, User, Sparkles, 
  Zap, Star, TrendingUp, Globe, Shield, Crown, Rocket, Target,
  ArrowRight, Plus, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import AITwinCard from '../components/AITwinCard';
import ChatInterface from '../components/ChatInterface';
import ReputationLeaderboard from '../components/ReputationLeaderboard';
import NetworkStatus from '../components/NetworkStatus';
import DashboardTab from '../components/DashboardTab';
import { ChatTab, LeaderboardTab, ProfileTab, SettingsTab, MintAITwinModal } from '../components/TabComponents';
import { useWallet } from '../hooks/useWallet';
import { useAITwin } from '../hooks/useAITwin';
import { useReputation } from '../hooks/useReputation';

export default function Home() {
  const { isConnected, address, chainId } = useWallet();
  const { aiTwin, mintAITwin, isLoading: aiTwinLoading } = useAITwin();
  const { reputation, updateReputation } = useReputation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMintModal, setShowMintModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles, color: 'from-blue-500 to-purple-600' },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'from-green-500 to-teal-600' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'from-yellow-500 to-orange-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'from-pink-500 to-rose-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
  ];

  const handleMintAITwin = async (aiTwinData: any) => {
    try {
      setIsLoading(true);
      await mintAITwin(aiTwinData);
      setShowMintModal(false);
    } catch (error) {
      console.error('Failed to mint AI Twin:', error);
    } finally {
      setIsLoading(false);
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

      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        {/* Header */}
        <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    OnchainMind
                  </h1>
                  <p className="text-sm text-gray-400">AI-Powered Identity & SocialFi</p>
                </div>
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
              className="text-center py-32"
            >
              <div className="max-w-2xl mx-auto">
                {/* Hero Section */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative mb-12"
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Bot className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-bold text-white mb-6 leading-tight"
                >
                  Welcome to the Future of
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Onchain Identity
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300 mb-12 leading-relaxed"
                >
                  Create your AI Twin NFT, earn reputation through social interactions, and build your digital identity on the blockchain. The future of decentralized social networking starts here.
                </motion.p>

                {/* Feature Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                  {[
                    { icon: Bot, title: 'AI Twin NFTs', desc: 'Unique digital identities that learn and grow' },
                    { icon: Trophy, title: 'Reputation System', desc: 'Earn points through social interactions' },
                    { icon: Globe, title: 'Circle Layer', desc: 'Built on the fastest blockchain network' }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <WalletConnect />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-2 bg-black/20 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/10"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/25`
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </motion.nav>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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
              </AnimatePresence>
            </>
          )}
        </main>

        {/* Mint AI Twin Modal */}
        <AnimatePresence>
          {showMintModal && (
            <MintAITwinModal
              onClose={() => setShowMintModal(false)}
              onMint={handleMintAITwin}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
