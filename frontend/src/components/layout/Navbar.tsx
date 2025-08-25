"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Circle, Menu, X, User, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Circle className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CircleLayer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/circles" className="text-muted-foreground hover:text-foreground transition-colors">
              Circles
            </Link>
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <Link href="/circles" className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                Circles
              </Link>
              <Link href="/marketplace" className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                Marketplace
              </Link>
              <Link href="/about" className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                About
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/signin" className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                  Sign In
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
