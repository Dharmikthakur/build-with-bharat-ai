import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Coins, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { CampaignStudio } from './components/CampaignStudio';
import { ActiveCampaigns } from './components/ActiveCampaigns';
import { CreatorDiscovery } from './components/CreatorDiscovery';
import { Campaign, Milestone, AlgorandWalletState, PlatformStats } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('studio');
  const [userRole, setUserRole] = useState<'brand' | 'creator' | 'admin'>('brand');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Algorand Wallet State
  const [wallet, setWallet] = useState<AlgorandWalletState>({
    isConnected: true,
    address: 'ALGO47GOPLAUSIBLE99TESTNETBRANDWALLET7728X4',
    walletType: 'Pera Wallet',
    balanceAlgo: 24500,
    network: 'Testnet',
  });

  // Global Platform Data State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalEscrowLockedAlgo: 34500,
    totalPayoutsReleasedAlgo: 18200,
    activeCampaignsCount: 4,
    x402TransactionsCount: 142,
    verifiedCreatorsCount: 88,
    aiOraclesOnlineCount: 12,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaignsAndStats = async () => {
    try {
      const [campRes, statsRes] = await Promise.all([
        fetch('/api/campaigns').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ]);
      setCampaigns(campRes);
      setStats(statsRes);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching app data:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndStats();
  }, []);

  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    setStats(prev => ({
      ...prev,
      totalEscrowLockedAlgo: prev.totalEscrowLockedAlgo + newCampaign.totalBudgetAlgo,
      activeCampaignsCount: prev.activeCampaignsCount + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole={userRole}
        onRoleChange={setUserRole}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Area based on Selected Tab */}
      <main className="flex-1">
        {currentTab === 'studio' && (
          <CampaignStudio
            onCampaignCreated={handleCampaignCreated}
            wallet={wallet}
            onNavigateToEscrow={() => setCurrentTab('escrow')}
          />
        )}

        {currentTab === 'escrow' && (
          <ActiveCampaigns
            campaigns={campaigns}
            wallet={wallet}
            onRefreshCampaigns={fetchCampaignsAndStats}
          />
        )}

        {currentTab === 'creators' && (
          <CreatorDiscovery
            campaigns={campaigns}
          />
        )}
      </main>

      {/* Algorand Wallet Connection & Faucet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onUpdateWallet={setWallet}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#050505] py-8 text-xs text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">
              A
            </div>
            <span className="font-semibold text-zinc-100">
              CreatorEscrow Algorand Marketplace
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              Algorand Testnet
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('studio')}
              className="hover:text-emerald-400 transition"
            >
              AI Campaign Studio
            </button>
            <button
              onClick={() => setCurrentTab('escrow')}
              className="hover:text-emerald-400 transition"
            >
              Escrow Campaigns
            </button>
            <button
              onClick={() => setCurrentTab('creators')}
              className="hover:text-cyan-400 transition"
            >
              Creators
            </button>
            <a
              href="https://testnet.explorer.perawallet.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition"
            >
              Algorand Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
