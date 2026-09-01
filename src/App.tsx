import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Zap, 
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
import { MilestoneVerification } from './components/MilestoneVerification';
import { X402FacilitatorDashboard } from './components/X402FacilitatorDashboard';
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

  // Cross-Navigation Context State
  const [targetCampaign, setTargetCampaign] = useState<Campaign | null>(null);
  const [targetMilestone, setTargetMilestone] = useState<Milestone | null>(null);

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

  const handleSelectCampaignForVerification = (campaign: Campaign, milestone: Milestone) => {
    setTargetCampaign(campaign);
    setTargetMilestone(milestone);
    setCurrentTab('verify');
  };

  const handleSelectCampaignForSubmission = (campaign: Campaign, milestone: Milestone) => {
    setTargetCampaign(campaign);
    setTargetMilestone(milestone);
    setCurrentTab('verify');
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

      {/* Global Live Protocol Status Ribbon */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-400">Algorand Testnet Escrow (Flow A):</span>
              <span className="font-mono font-bold text-emerald-400">
                {stats.totalEscrowLockedAlgo.toLocaleString()} ALGO Locked
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-zinc-400">x402 GoPlausible Facilitator (Flow B):</span>
              <span className="font-mono font-bold text-cyan-400">
                {stats.x402TransactionsCount} M2M Settled
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-zinc-400">Gemini 3.7 AI Oracles:</span>
              <span className="font-bold text-purple-300">
                {stats.aiOraclesOnlineCount} Nodes Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              ARC-4 PyTeAL Verified
            </span>
            <button
              onClick={() => setCurrentTab('x402')}
              className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-cyan-400 transition"
            >
              x402 Protocol Ledger
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

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
            onSelectCampaignForVerification={handleSelectCampaignForVerification}
            onSelectCampaignForSubmission={handleSelectCampaignForSubmission}
            wallet={wallet}
            onRefreshCampaigns={fetchCampaignsAndStats}
          />
        )}

        {currentTab === 'creators' && (
          <CreatorDiscovery
            campaigns={campaigns}
          />
        )}

        {currentTab === 'verify' && (
          <MilestoneVerification
            campaigns={campaigns}
            selectedCampaign={targetCampaign}
            selectedMilestone={targetMilestone}
            onRefreshCampaigns={fetchCampaignsAndStats}
            wallet={wallet}
          />
        )}

        {currentTab === 'x402' && (
          <X402FacilitatorDashboard
            wallet={wallet}
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
              CreatorEscrow AI & x402 GoPlausible Protocol
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              Algorand Testnet
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('escrow')}
              className="hover:text-emerald-400 transition"
            >
              Escrow Campaigns
            </button>
            <button
              onClick={() => setCurrentTab('x402')}
              className="hover:text-cyan-400 transition"
            >
              x402 Facilitator
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
