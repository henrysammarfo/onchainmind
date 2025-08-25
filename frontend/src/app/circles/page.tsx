"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search, Filter } from 'lucide-react';

export default function CirclesPage() {
  const mockCircles = [
    {
      id: 1,
      name: "Tech Innovators",
      description: "Building the future of technology through collaboration and innovation",
      members: 156,
      isPrivate: false,
      category: "Technology",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=Tech"
    },
    {
      id: 2,
      name: "Creative Minds",
      description: "Exploring art, design, and creative expression",
      members: 89,
      isPrivate: true,
      category: "Arts",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=Creative"
    },
    {
      id: 3,
      name: "Blockchain Pioneers",
      description: "Advancing blockchain technology and DeFi solutions",
      members: 234,
      isPrivate: false,
      category: "Blockchain",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=Blockchain"
    },
    {
      id: 4,
      name: "AI Researchers",
      description: "Pushing the boundaries of artificial intelligence",
      members: 67,
      isPrivate: true,
      category: "AI",
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=AI"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Discover Circles</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join exclusive communities and build meaningful connections with like-minded individuals
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search circles..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Circles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCircles.map((circle) => (
            <div key={circle.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <img src={circle.image} alt={circle.name} className="w-16 h-16 rounded-lg" />
                  <div className="flex items-center space-x-2">
                    {circle.isPrivate && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                        Private
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                      {circle.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{circle.name}</h3>
                <p className="text-muted-foreground mb-4">{circle.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{circle.members} members</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Circle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
