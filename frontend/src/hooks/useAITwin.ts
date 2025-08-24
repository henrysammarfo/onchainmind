import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

interface AITwin {
  id: string;
  name: string;
  personality: string;
  traits: string[];
  reputation: number;
  createdAt: string;
  lastInteraction: string;
  activityScores: number[];
}

export function useAITwin() {
  const { isConnected, address, signer } = useWallet();
  const [aiTwin, setAITwin] = useState<AITwin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contract addresses from deployment
  const AI_IDENTITY_ADDRESS = process.env.NEXT_PUBLIC_AI_IDENTITY_ADDRESS || '0x3D177eC72cFc2E95F55aCa056dF5820A1c50865C';
  const AI_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AI_REGISTRY_ADDRESS || '0x7EAF008952aB45009b129F83735622bE3Ab19494';

  // Simplified ABI for the contracts
  const AI_IDENTITY_ABI = [
    'function mintAITwin(address user, string memory name, string memory personality, string[] memory traits) external returns (uint256)',
    'function getUserAITwinId(address user) external view returns (uint256)',
    'function getAITwinData(uint256 tokenId) external view returns (tuple(string name, string personality, uint256 reputation, uint256 createdAt, uint256 lastInteraction, string[] traits, uint256[] activityScores))',
    'function hasAITwin(address user) external view returns (bool)',
    'function ownerOf(uint256 tokenId) external view returns (address)',
  ];

  // Load AI Twin data when wallet connects
  useEffect(() => {
    if (isConnected && address && signer) {
      loadAITwin();
    } else {
      setAITwin(null);
    }
  }, [isConnected, address, signer]);

  const loadAITwin = async () => {
    if (!signer || !address) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(AI_IDENTITY_ADDRESS, AI_IDENTITY_ABI, signer);
      
      // Check if user has an AI Twin
      const hasAITwin = await contract.hasAITwin(address);
      
      if (hasAITwin) {
        // Get the AI Twin ID
        const tokenId = await contract.getUserAITwinId(address);
        
        // Get AI Twin data
        const aiTwinData = await contract.getAITwinData(tokenId);
        
        setAITwin({
          id: tokenId.toString(),
          name: aiTwinData.name,
          personality: aiTwinData.personality,
          traits: aiTwinData.traits,
          reputation: aiTwinData.reputation.toNumber(),
          createdAt: new Date(aiTwinData.createdAt.toNumber() * 1000).toISOString(),
          lastInteraction: new Date(aiTwinData.lastInteraction.toNumber() * 1000).toISOString(),
          activityScores: aiTwinData.activityScores.map((score: any) => score.toNumber()),
        });
      }
    } catch (error) {
      console.error('Error loading AI Twin:', error);
      // For demo purposes, create a mock AI Twin if contract call fails
      setAITwin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const mintAITwin = async (aiTwinData: {
    name: string;
    personality: string;
    traits: string[];
    skills: string[];
  }) => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(AI_IDENTITY_ADDRESS, AI_IDENTITY_ABI, signer);
      
      // Combine traits and skills
      const allTraits = [...aiTwinData.traits, ...aiTwinData.skills].filter(Boolean);
      
      // Call the mint function
      const tx = await contract.mintAITwin(
        address,
        aiTwinData.name,
        aiTwinData.personality,
        allTraits
      );
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Reload AI Twin data
      await loadAITwin();
      
      return tx;
    } catch (error) {
      console.error('Error minting AI Twin:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAITwin = async (updates: Partial<AITwin>) => {
    if (!signer || !aiTwin) {
      throw new Error('No AI Twin to update');
    }

    setIsLoading(true);
    try {
      // This would call the contract's update function
      // For now, we'll update locally
      setAITwin(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating AI Twin:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const chatWithAITwin = async (message: string) => {
    if (!aiTwin) {
      throw new Error('No AI Twin available');
    }

    try {
      // Call the backend API for AI chat
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          aiTwinId: aiTwin.id,
          userId: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error chatting with AI Twin:', error);
      // Return a mock response for demo
      return `Hello! I'm ${aiTwin.name}, your AI Twin. I understand you said: "${message}". As your AI companion, I'm here to help you navigate the blockchain world and grow your reputation!`;
    }
  };

  return {
    aiTwin,
    isLoading,
    mintAITwin,
    updateAITwin,
    chatWithAITwin,
    loadAITwin,
  };
}
