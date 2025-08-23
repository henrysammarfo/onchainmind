import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { isConnected, address, chainId, connect, disconnect, switchNetwork } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 1234: // Replace with actual Circle Layer testnet chain ID
        return 'Circle Layer Testnet';
      case 31337:
        return 'Local Hardhat';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'text-green-400';
      case 1234: // Circle Layer testnet
        return 'text-blue-400';
      case 31337:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 border border-dark-600"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="hidden sm:inline">{formatAddress(address!)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
      </motion.button>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 mt-2 w-64 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-50"
        >
          <div className="p-4 space-y-3">
            {/* Wallet Info */}
            <div className="border-b border-dark-700 pb-3">
              <div className="text-sm text-dark-300 mb-1">Connected Wallet</div>
              <div className="font-mono text-sm text-white break-all">{address}</div>
            </div>

            {/* Network Info */}
            <div className="border-b border-dark-700 pb-3">
              <div className="text-sm text-dark-300 mb-1">Network</div>
              <div className={`text-sm font-medium ${getNetworkColor(chainId!)}`}>
                {getNetworkName(chainId!)}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Handle network switching
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Switch Network</span>
              </button>
              
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default WalletConnect;
