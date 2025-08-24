import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

interface Reputation {
  score: number;
  level: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
  achievements: string[];
  transactionHistory: number[];
}

export function useReputation() {
  const { isConnected, address, signer } = useWallet();
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contract address from deployment
  const REPUTATION_SCORE_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_SCORE_ADDRESS || '0x4Cb95F24330B5081e11c354Dcf4901D096131f4A';

  // Simplified ABI for the reputation contract
  const REPUTATION_ABI = [
    'function balanceOf(address account) external view returns (uint256)',
    'function userReputation(address user) external view returns (tuple(uint256 totalEarned, uint256 totalSpent, uint256 lastUpdated, uint256 level, uint256[] transactionHistory, string[] achievements))',
    'function calculateLevel(uint256 balance) external view returns (uint256)',
    'function awardReputation(address user, uint256 amount, string memory reason) external',
    'function deductReputation(address user, uint256 amount, string memory reason) external',
  ];

  // Load reputation data when wallet connects
  useEffect(() => {
    if (isConnected && address && signer) {
      loadReputation();
    } else {
      setReputation(null);
    }
  }, [isConnected, address, signer]);

  const loadReputation = async () => {
    if (!signer || !address) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(REPUTATION_SCORE_ADDRESS, REPUTATION_ABI, signer);
      
      // Get current balance (reputation score)
      const balance = await contract.balanceOf(address);
      const score = balance.toNumber();
      
      // Get user reputation data
      const reputationData = await contract.userReputation(address);
      
      // Calculate level
      const level = await contract.calculateLevel(balance);
      
      setReputation({
        score,
        level: level.toNumber(),
        totalEarned: reputationData.totalEarned.toNumber(),
        totalSpent: reputationData.totalSpent.toNumber(),
        lastUpdated: new Date(reputationData.lastUpdated.toNumber() * 1000).toISOString(),
        achievements: reputationData.achievements,
        transactionHistory: reputationData.transactionHistory.map((tx: any) => tx.toNumber()),
      });
    } catch (error) {
      console.error('Error loading reputation:', error);
      // For demo purposes, create mock reputation data
      setReputation({
        score: 100,
        level: 1,
        totalEarned: 100,
        totalSpent: 0,
        lastUpdated: new Date().toISOString(),
        achievements: ['First Steps'],
        transactionHistory: [100],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateReputation = async (amount: number, reason: string) => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(REPUTATION_SCORE_ADDRESS, REPUTATION_ABI, signer);
      
      // Award reputation (this would typically be called by the backend/owner)
      const tx = await contract.awardReputation(address, amount, reason);
      await tx.wait();
      
      // Reload reputation data
      await loadReputation();
      
      return tx;
    } catch (error) {
      console.error('Error updating reputation:', error);
      // For demo, update locally
      setReputation(prev => prev ? {
        ...prev,
        score: prev.score + amount,
        totalEarned: prev.totalEarned + amount,
        lastUpdated: new Date().toISOString(),
        transactionHistory: [...prev.transactionHistory, amount],
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeaderboard = async () => {
    try {
      // This would typically call a backend API to get leaderboard data
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reputation/leaderboard`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Return mock leaderboard data
      return [
        { address: '0x1234...5678', score: 1500, level: 5, name: 'CryptoMaster' },
        { address: '0x2345...6789', score: 1200, level: 4, name: 'BlockchainPro' },
        { address: '0x3456...7890', score: 1000, level: 3, name: 'DeFiExplorer' },
        { address: address, score: reputation?.score || 100, level: reputation?.level || 1, name: 'You' },
      ].sort((a, b) => b.score - a.score);
    }
  };

  const calculateLevelProgress = () => {
    if (!reputation) return { current: 0, next: 100, progress: 0 };
    
    const levelThresholds = [0, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
    const currentLevel = reputation.level;
    const currentThreshold = levelThresholds[currentLevel - 1] || 0;
    const nextThreshold = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
    
    const progress = ((reputation.score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    
    return {
      current: currentThreshold,
      next: nextThreshold,
      progress: Math.min(100, Math.max(0, progress)),
    };
  };

  return {
    reputation,
    isLoading,
    updateReputation,
    loadReputation,
    getLeaderboard,
    calculateLevelProgress,
  };
}
