import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Coins, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { AlgorandWalletState } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: AlgorandWalletState;
  setWallet?: React.Dispatch<React.SetStateAction<AlgorandWalletState>>;
  onUpdateWallet?: React.Dispatch<React.SetStateAction<AlgorandWalletState>>;
  userRole?: 'brand' | 'creator' | 'oracle' | 'admin';
  setUserRole?: (role: any) => void;
}

const PRESET_ACCOUNTS = [
  {
    role: 'brand' as const,
    label: 'Brand Enterprise Account (Plausible Labs)',
    address: 'BRANDPLSZ88TYK499VNB7312LKMP099LKJHGFDSA88849',
    balance: 8500,
    type: 'Pera Wallet Connected',
  },
  {
    role: 'creator' as const,
    label: 'Creator Account (Elena Rostova)',
    address: 'ELENAQ7XK4M9PL2VN58TYZZ3WBCP49MTRQ9VBN82XLLM7354',
    balance: 1420,
    type: 'Defly Wallet Connected',
  },
  {
    role: 'oracle' as const,
    label: 'AI Oracle & GoPlausible Node Account',
    address: 'GOPLAUSIBLE77TESTNETFACILITATOR992841029384',
    balance: 24500,
    type: 'Algorand Node Signer',
  },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  setWallet,
  onUpdateWallet,
  userRole,
  setUserRole,
}) => {
  const [copied, setCopied] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);

  const updateWallet = onUpdateWallet || setWallet || (() => {});

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFaucetAirdrop = () => {
    setIsAirdropping(true);
    setTimeout(() => {
      updateWallet(prev => ({
        ...prev,
        balanceAlgo: prev.balanceAlgo + 1000,
        balanceUsd: Math.round((prev.balanceAlgo + 1000) * 0.32),
      }));
      setIsAirdropping(false);
      setAirdropSuccess(true);
      setTimeout(() => setAirdropSuccess(false), 3000);
    }, 1200);
  };

  const handleSelectAccount = (acc: typeof PRESET_ACCOUNTS[0]) => {
    updateWallet({
      isConnected: true,
      address: acc.address,
      network: 'Testnet',
      balanceAlgo: acc.balance,
      balanceUsd: Math.round(acc.balance * 0.32),
      walletProvider: acc.type.includes('Pera') ? 'Pera Wallet' : acc.type.includes('Defly') ? 'Defly' : 'Testnet Simulated',
    });
    if (setUserRole) {
      setUserRole(acc.role);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#050505] p-6 shadow-2xl shadow-black/80">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">Algorand Wallet</h3>
              <p className="text-xs text-zinc-400">@txnlab/use-wallet Multi-Provider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Active Account Box */}
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Connected Account</span>
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Algorand Testnet
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-100 tracking-tight">
                {wallet.balanceAlgo.toLocaleString()} <span className="text-sm font-medium text-emerald-400">ALGO</span>
              </div>
              <div className="text-xs text-zinc-400">
                ≈ ${wallet.balanceUsd.toLocaleString()} USD
              </div>
            </div>

            <button
              onClick={handleFaucetAirdrop}
              disabled={isAirdropping}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition disabled:opacity-50"
            >
              {isAirdropping ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : airdropSuccess ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Coins className="h-3.5 w-3.5 text-emerald-400" />
              )}
              {isAirdropping ? 'Requesting...' : airdropSuccess ? '+1,000 ALGO Received' : 'Faucet +1,000 ALGO'}
            </button>
          </div>

          {/* Address Bar */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2 text-xs border border-zinc-800/60">
            <span className="font-mono text-zinc-300 truncate max-w-[240px]">
              {wallet.address}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopy}
                className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                title="Copy Address"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <a
                href={`https://lora.algokit.io/testnet/account/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
                className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                title="View on Explorer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Switch Persona / Accounts */}
        <div className="mt-5">
          <label className="text-xs font-medium text-zinc-400">
            Quick Persona Switcher (Simulate Brand & Creator Roles):
          </label>
          <div className="mt-2 space-y-2">
            {PRESET_ACCOUNTS.map((acc) => {
              const isSelected = wallet.address === acc.address;
              return (
                <button
                  key={acc.address}
                  onClick={() => handleSelectAccount(acc)}
                  className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">
                      {acc.label}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {acc.address.substring(0, 8)}...{acc.address.substring(acc.address.length - 8)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      {acc.balance.toLocaleString()} ALGO
                    </div>
                    <div className="text-[10px] text-zinc-400">{acc.type}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            Done & Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
