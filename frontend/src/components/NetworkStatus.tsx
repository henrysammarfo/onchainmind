import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const NetworkStatus: React.FC = () => {
  const { isConnected, chainId } = useWallet();

  const getNetworkInfo = () => {
    if (!isConnected) {
      return {
        name: 'Not Connected',
        status: 'disconnected',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        icon: WifiOff,
      };
    }

    // Circle Layer testnet
    if (chainId === 28525) {
      return {
        name: 'Circle Layer',
        status: 'connected',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        icon: Wifi,
      };
    }

    // Wrong network
    return {
      name: 'Wrong Network',
      status: 'wrong',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      icon: AlertCircle,
    };
  };

  const networkInfo = getNetworkInfo();
  const Icon = networkInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${networkInfo.bgColor} ${networkInfo.borderColor}`}
    >
      <Icon className={`w-4 h-4 ${networkInfo.color}`} />
      <span className={`text-sm font-medium ${networkInfo.color}`}>
        {networkInfo.name}
      </span>
      
      {/* Status indicator dot */}
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${
          networkInfo.status === 'connected' ? 'bg-green-400' :
          networkInfo.status === 'wrong' ? 'bg-yellow-400' : 'bg-red-400'
        }`} />
        {networkInfo.status === 'connected' && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75" />
        )}
      </div>
    </motion.div>
  );
};

export default NetworkStatus;
