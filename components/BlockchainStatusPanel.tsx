import React, { useState, useEffect } from 'react';
import { useTranslations } from '../i18n';
import { Cube } from './icons';

interface BlockchainStatusPanelProps {
  totalReports: number;
}

const BlockchainStatusPanel: React.FC<BlockchainStatusPanelProps> = ({ totalReports }) => {
  const { t } = useTranslations();
  const [currentBlock, setCurrentBlock] = useState(6843021);
  const [blockHash, setBlockHash] = useState('');

  const generateHash = () => `0x${[...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...`;

  useEffect(() => {
    setBlockHash(generateHash());
    const timer = setTimeout(() => {
      setCurrentBlock(prev => prev + 1);
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentBlock]);

  return (
    <div className="my-8 bg-white text-gray-700 rounded-lg p-4 shadow-md border border-gray-200">
      <h3 className="text-center font-semibold text-gray-500 mb-3 text-sm tracking-wider uppercase">{t('blockchainStatus.title')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-100">
          <p className="text-xs text-gray-500">{t('blockchainStatus.nextBlock')}</p>
          <div className="flex items-center space-x-2">
            <Cube className="w-4 h-4 text-blue-500" />
            <p className="text-lg font-bold text-blue-600 animate-pulse">{currentBlock + 1}</p>
          </div>
        </div>
        <div className="p-2">
          <p className="text-xs text-gray-500">{t('blockchainStatus.totalTransactions')}</p>
          <p className="text-lg font-mono font-bold text-gray-800">{totalReports.toLocaleString()}</p>
        </div>
        <div className="p-2">
          <p className="text-xs text-gray-500">{t('blockchainStatus.status')}</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            <p className="text-lg font-bold text-green-600">{t('blockchainStatus.statusOperational')}</p>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 p-2 overflow-hidden">
          <p className="text-xs text-gray-500">{t('blockchainStatus.latestHash')}</p>
          <p className="text-sm font-mono truncate text-gray-500" title={blockHash}>{blockHash}</p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatusPanel;