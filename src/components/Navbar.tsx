import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Users, 
  CheckCircle2, 
  Zap, 
  Wallet, 
  Coins, 
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Building2,
  Palette,
  Bot
} from 'lucide-react';
import { AlgorandWalletState } from '../types';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  wallet: AlgorandWalletState;
  onOpenWalletModal: () => void;
  userRole: 'brand' | 'creator' | 'oracle' | 'admin';
  onRoleChange?: (role: any) => void;
  setUserRole?: (role: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  onTabChange,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  userRole,
  onRoleChange,
  setUserRole,
}) => {
  const current = currentTab || activeTab || 'studio';
  const changeTab = onTabChange || setActiveTab || (() => {});
  const changeRole = onRoleChange || setUserRole || (() => {});

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#050505]/95 backdrop-blur-md">
      {/* Top Protocol Status Banner */}
      <div className="border-b border-zinc-800/60 bg-gradient-to-r from-emerald-950/30 via-zinc-900/40 to-cyan-950/30 px-4 py-1.5 text-xs text-zinc-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
              Algorand Testnet Active
            </span>
            <span className="hidden text-zinc-600 sm:inline">•</span>
            <span className="hidden items-center gap-1 text-zinc-400 sm:inline-flex">
              <Zap className="h-3 w-3 text-cyan-400" />
              x402 GoPlausible Facilitator Online
            </span>
            <span className="hidden text-zinc-600 md:inline">•</span>
            <span className="hidden text-zinc-400 md:inline">
              Flow A (Escrow) + Flow B (M2M Micropayments)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md bg-zinc-900/90 p-0.5 border border-zinc-800 text-[11px]">
              <button
                onClick={() => changeRole('brand')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors ${
                  userRole === 'brand'
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Building2 className="h-3 w-3" />
                Brand
              </button>
              <button
                onClick={() => changeRole('creator')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors ${
                  userRole === 'creator'
                    ? 'bg-cyan-500 text-zinc-950 font-semibold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Palette className="h-3 w-3" />
                Creator
              </button>
              <button
                onClick={() => changeRole('oracle')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors ${
                  userRole === 'oracle' || userRole === 'admin'
                    ? 'bg-purple-500 text-white font-semibold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bot className="h-3 w-3" />
                AI Oracle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => changeTab('studio')}
            className="flex cursor-pointer items-center gap-2.5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-zinc-100 text-lg">
                  Creator<span className="text-emerald-400">Escrow</span>
                </span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  ALGORAND
                </span>
                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                  x402
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                AI Milestone Escrow & M2M Micropayments
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-zinc-900/70 p-1 border border-zinc-800/80">
          <button
            onClick={() => changeTab('studio')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              current === 'studio'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            AI Campaign Studio
          </button>

          <button
            onClick={() => changeTab('escrow')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              current === 'escrow' || current === 'campaigns'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            Escrow Campaigns
          </button>

          <button
            onClick={() => changeTab('creators')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              current === 'creators'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            AI Match Creator
          </button>

          <button
            onClick={() => changeTab('verify')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              current === 'verify' || current === 'verification'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Oracle Verification
          </button>

          <button
            onClick={() => changeTab('x402')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              current === 'x402'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            x402 Facilitator
          </button>
        </nav>

        {/* Right Wallet & Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenWalletModal}
            className="flex items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-200 shadow-sm transition hover:border-emerald-500/50 hover:bg-zinc-800/80"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Coins className="h-3 w-3" />
            </div>
            <div className="text-left leading-none">
              <div className="font-semibold text-zinc-100">
                {wallet.balanceAlgo.toLocaleString()} ALGO
              </div>
              <div className="text-[10px] text-zinc-400">
                {wallet.address.substring(0, 4)}...{wallet.address.substring(wallet.address.length - 4)}
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Sub-nav */}
      <div className="flex lg:hidden overflow-x-auto border-t border-zinc-800/80 px-4 py-2 gap-1.5 no-scrollbar bg-[#050505]">
        {[
          { id: 'studio', label: 'AI Studio', icon: Sparkles },
          { id: 'escrow', label: 'Escrows', icon: Layers },
          { id: 'creators', label: 'Creators', icon: Users },
          { id: 'verify', label: 'Oracle', icon: CheckCircle2 },
          { id: 'x402', label: 'x402 Pay', icon: Zap },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id || (item.id === 'escrow' && current === 'campaigns') || (item.id === 'verify' && current === 'verification');
          return (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 bg-zinc-900 border border-zinc-800'
              }`}
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
