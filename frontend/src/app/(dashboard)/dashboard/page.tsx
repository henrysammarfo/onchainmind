"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Circle, 
  Users, 
  Trophy, 
  Plus, 
  Settings, 
  Bell,
  Search,
  Filter,
  Star,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const mockData = {
    user: {
      name: "Alex Johnson",
      email: "alex@example.com",
      reputation: 1250,
      level: "Gold",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    aiTwins: [
      {
        id: 1,
        name: "Quantum Alex",
        personality: "Analytical & Creative",
        level: 15,
        experience: 12500,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=Quantum"
      },
      {
        id: 2,
        name: "Artistic Alex",
        personality: "Expressive & Imaginative",
        level: 12,
        experience: 8900,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=Artistic"
      }
    ],
    circles: [
      {
        id: 1,
        name: "Tech Innovators",
        members: 156,
        description: "Building the future of technology",
        isPrivate: false,
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=Tech"
      },
      {
        id: 2,
        name: "Creative Minds",
        members: 89,
        description: "Exploring art and creativity",
        isPrivate: true,
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=Creative"
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: "reputation",
        message: "Earned +50 reputation points",
        timestamp: "2 hours ago",
        icon: Trophy
      },
      {
        id: 2,
        type: "circle",
        message: "Joined 'Tech Innovators' circle",
        timestamp: "1 day ago",
        icon: Users
      },
      {
        id: 3,
        type: "aiTwin",
        message: "AI Twin 'Quantum Alex' leveled up!",
        timestamp: "3 days ago",
        icon: Circle
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={mockData.user.avatar} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full border-4 border-primary/20"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{mockData.user.name}</h1>
                <p className="text-muted-foreground">{mockData.user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{mockData.user.reputation} points</span>
                  <span className="text-sm text-muted-foreground">• {mockData.user.level} Level</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ai-twins', label: 'AI Twins' },
              { id: 'circles', label: 'Circles' },
              { id: 'reputation', label: 'Reputation' },
              { id: 'activity', label: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Circle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">AI Twins</p>
                    <p className="text-2xl font-bold text-foreground">{mockData.aiTwins.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Circles</p>
                    <p className="text-2xl font-bold text-foreground">{mockData.circles.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Reputation</p>
                    <p className="text-2xl font-bold text-foreground">{mockData.user.reputation}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold text-foreground">{mockData.user.level}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Twins Section */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Your AI Twins</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Twin
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockData.aiTwins.map((twin) => (
                  <div key={twin.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img src={twin.image} alt={twin.name} className="w-16 h-16 rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{twin.name}</h3>
                        <p className="text-sm text-muted-foreground">{twin.personality}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-muted-foreground">Level {twin.level}</span>
                          <span className="text-sm text-muted-foreground">{twin.experience} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {mockData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <activity.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-twins' && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">AI Twins Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Twin
              </Button>
            </div>
            <p className="text-muted-foreground">Manage and customize your AI Twins here.</p>
          </div>
        )}

        {activeTab === 'circles' && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Your Circles</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            </div>
            <p className="text-muted-foreground">Manage your social circles and communities.</p>
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Reputation & Achievements</h2>
            <p className="text-muted-foreground">Track your reputation points and achievements.</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Activity Feed</h2>
            <p className="text-muted-foreground">View your complete activity history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
