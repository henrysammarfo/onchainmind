'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { 
  Bot, 
  Trophy, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
  Activity
} from 'lucide-react';
import { apiClient, BlockchainStatus, ContractInfo } from '@/lib/api';

export default function HomePage() {
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus | null>(null);
  const [contracts, setContracts] = useState<ContractInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setIsLoading(true);
      
      // Check backend connection
      const connected = await apiClient.checkConnection();
      setIsConnected(connected);

      if (connected) {
        // Get blockchain status and contracts
        const [statusData, contractData] = await Promise.all([
          apiClient.getBlockchainStatus().catch(() => null),
          apiClient.getContractAddresses().catch(() => null)
        ]);
        
        setBlockchainStatus(statusData);
        setContracts(contractData);
      }
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Status Indicator */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Backend Connected' : 'Backend Offline'}</span>
              {blockchainStatus && (
                <>
                  <span>•</span>
                  <span>{blockchainStatus.network}</span>
                </>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              AI-Powered
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Onchain Identity
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Create your AI Twin NFT, build reputation through social interactions, and explore the future of decentralized identity on Circle Layer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" variant="gradient" className="text-lg px-8 py-4">
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/ai-twins">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Explore AI Twins
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Live Backend Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time AI Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Circle Layer Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      {isLoading ? (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-4 text-lg">Connecting to backend...</span>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Backend Status */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Backend Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isConnected ? 'All systems operational' : 'Backend server unavailable'}
                  </p>
                </CardContent>
              </Card>

              {/* Blockchain Status */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Blockchain</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blockchainStatus ? (
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-green-600">{blockchainStatus.network}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Chain ID: {blockchainStatus.chainId}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-yellow-600">Checking...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Smart Contracts */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Smart Contracts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contracts ? (
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-green-600">Deployed</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {Object.keys(contracts).length} contracts active
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-yellow-600">Loading...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need for
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                onchain identity
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              OnchainMind combines AI-powered identity management with social networking and reputation building on the blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI Twin NFTs",
                description: "Create unique digital identities that learn and grow with your interactions. Each AI Twin is a one-of-a-kind NFT on the blockchain.",
                features: ["Unique personality", "Learning capabilities", "Blockchain ownership"]
              },
              {
                icon: Users,
                title: "Social Reputation",
                description: "Build your onchain reputation through positive interactions, contributions, and community engagement.",
                features: ["Gamified scoring", "Achievement system", "Leaderboards"]
              },
              {
                icon: Trophy,
                title: "Real-time Chat",
                description: "Chat with your AI Twin in real-time using WebSocket connections for instant responses and interactions.",
                features: ["Live conversations", "Context awareness", "Learning from chats"]
              },
              {
                icon: Zap,
                title: "Circle Layer Speed",
                description: "Built on Circle Layer, the fastest blockchain network. Experience instant transactions and seamless user experience.",
                features: ["Instant transactions", "Low fees", "High throughput"]
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is encrypted and secure. Maintain privacy while building your public reputation on the blockchain.",
                features: ["End-to-end encryption", "Privacy controls", "Data ownership"]
              },
              {
                icon: Globe,
                title: "Live Integration",
                description: "Fully integrated with live backend services, smart contracts, and real-time features for a complete experience.",
                features: ["Live backend", "Smart contracts", "Real-time updates"]
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to explore your
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI-powered identity?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the future of onchain identity with live AI interactions, real-time reputation building, and seamless blockchain integration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4">
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/ai-twins">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Create AI Twin
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            Live backend integration • Real-time features • Circle Layer blockchain
          </p>
        </div>
      </section>
    </div>
  );
}