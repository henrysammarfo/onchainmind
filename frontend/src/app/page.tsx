import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Circle, 
  Users, 
  Trophy, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Circle className="w-4 h-4" />
              <span>CircleLayer Testnet Live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Onchain Identity
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on the fastest blockchain network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/circles">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Explore Circles
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need to build your
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                digital identity
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              CircleLayer combines AI-powered identity management with social networking and reputation building on the blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Circle,
                title: "AI Twin NFTs",
                description: "Create unique digital identities that learn and grow with your interactions. Each AI Twin is a one-of-a-kind NFT on the blockchain.",
                features: ["Unique personality", "Learning capabilities", "Blockchain ownership"]
              },
              {
                icon: Users,
                title: "Social Circles",
                description: "Join exclusive communities and build meaningful connections. Create private or public circles with like-minded individuals.",
                features: ["Private & public circles", "Member management", "Content sharing"]
              },
              {
                icon: Trophy,
                title: "Reputation System",
                description: "Earn reputation points through positive interactions, contributions, and community engagement. Build your onchain credibility.",
                features: ["Gamified scoring", "Badge system", "Leaderboards"]
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built on CircleLayer, the fastest blockchain network. Experience instant transactions and seamless user experience.",
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
                title: "Global Network",
                description: "Connect with users worldwide. Join the global movement towards decentralized identity and social networking.",
                features: ["Worldwide access", "Multi-language support", "24/7 availability"]
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "500+", label: "Circles Created" },
              { number: "50K+", label: "AI Twins Minted" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to build your
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              onchain identity?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of users already building their digital future on CircleLayer. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4">
                Create Your Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/circles">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Browse Circles
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free forever • Setup in 2 minutes
          </p>
        </div>
      </section>
    </div>
  );
}
