import React, { useState } from 'react';
import { 
  Layers, 
  Lock, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Users, 
  ArrowRight, 
  Zap, 
  FileText,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, Milestone, AlgorandWalletState } from '../types';

interface ActiveCampaignsProps {
  campaigns: Campaign[];
  wallet: AlgorandWalletState;
  onRefreshCampaigns: () => void;
}

export const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({
  campaigns,
  wallet,
  onRefreshCampaigns,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReleasing, setIsReleasing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [submissionMilestone, setSubmissionMilestone] = useState<{ campaign: Campaign; milestone: Milestone } | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('https://x.com/creator/status/192837482');
  const [reportedViews, setReportedViews] = useState('45000');
  const [deliverableNotes, setDeliverableNotes] = useState('Campaign content published live.');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleOpenSubmitModal = (campaign: Campaign, milestone: Milestone) => {
    setSubmissionMilestone({ campaign, milestone });
    setReportedViews(String(milestone.targetMetric.targetValue || 25000));
  };

  const handleSubmitProof = async () => {
    if (!submissionMilestone) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/campaigns/${submissionMilestone.campaign.id}/milestones/${submissionMilestone.milestone.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableUrl,
          notes: deliverableNotes,
          reportedViews: Number(reportedViews) || submissionMilestone.milestone.targetMetric.targetValue,
        }),
      });
      if (res.ok) {
        setSubmissionMilestone(null);
        onRefreshCampaigns();
      }
    } catch (err) {
      console.error('Error submitting deliverable proof:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyMilestone = async (campaignId: string, milestoneId: string) => {
    setIsVerifying(milestoneId);
    try {
      const res = await fetch(`/api/oracle/verify-deliverable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          milestoneId,
        }),
      });
      if (res.ok) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#a855f7'],
        });
        onRefreshCampaigns();
      }
    } catch (err) {
      console.error('Error verifying milestone:', err);
    } finally {
      setIsVerifying(null);
    }
  };

  const handleReleasePayout = async (campaignId: string, milestoneId: string) => {
    setIsReleasing(milestoneId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/milestones/${milestoneId}/release-payout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#fbbf24'],
        });
        onRefreshCampaigns();
      }
    } catch (err) {
      console.error('Error releasing payout:', err);
    } finally {
      setIsReleasing(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header & Protocol Statistics */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              Algorand Escrow & Campaign Manager
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
            Live on-chain inspection of Algorand ARC-4 smart contract escrows. Funds remain locked until deliverable milestones are verified and released.
          </p>
        </div>

        <button
          onClick={onRefreshCampaigns}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-emerald-500/40 hover:text-white transition shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
          Sync On-Chain State
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, brands, or deliverables..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Web3 & Crypto', 'B2B SaaS', 'Gaming', 'Finance & Fintech'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column View: Campaign List (4 cols) & Escrow Contract Inspector (8 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Campaign List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Active Campaigns ({filteredCampaigns.length})
          </div>

          {filteredCampaigns.map((camp) => {
            const isSelected = activeCampaign?.id === camp.id;
            const completedCount = camp.milestones.filter(m => m.status === 'payout_released').length;
            const progressPercent = Math.round((completedCount / camp.milestones.length) * 100);

            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-500/60 bg-zinc-900 shadow-lg shadow-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-zinc-700">
                      {camp.category}
                    </span>
                    <h3 className="mt-2 text-xs font-bold text-zinc-100 line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400">{camp.brandName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-emerald-400">
                      {camp.totalBudgetAlgo.toLocaleString()} ALGO
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      App #{camp.algorandEscrow.appId}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Milestones: {completedCount}/{camp.milestones.length} Released</span>
                    <span className="font-semibold text-emerald-400">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Assigned Creator */}
                {camp.assignedCreatorName && (
                  <div className="mt-3 flex items-center gap-2 border-t border-zinc-800/80 pt-2.5 text-[11px]">
                    <img
                      src={camp.assignedCreatorAvatar}
                      alt={camp.assignedCreatorName}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    <span className="text-zinc-300 font-medium truncate">
                      {camp.assignedCreatorName}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Selected Campaign & Smart Contract Escrow Inspector */}
        <div className="lg:col-span-8">
          {activeCampaign ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      {activeCampaign.status === 'in_progress' ? 'ESCROW ACTIVE & FUNDED' : 'COMPLETED'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {activeCampaign.category}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-lg font-bold text-zinc-100 sm:text-xl">
                    {activeCampaign.title}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400 max-w-xl leading-relaxed">
                    {activeCampaign.description}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-right shrink-0">
                  <div className="text-[11px] text-zinc-400">Total Escrow Pool</div>
                  <div className="text-xl font-black text-emerald-400 tracking-tight">
                    {activeCampaign.totalBudgetAlgo.toLocaleString()} ALGO
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    ≈ ${(activeCampaign.totalBudgetAlgo * 0.32).toFixed(0)} USD
                  </div>
                </div>
              </div>

              {/* Algorand Smart Contract Metadata Grid */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Algorand Smart Contract Escrow State (ARC-4)
                  </div>
                  <a
                    href={`https://lora.algokit.io/testnet/application/${activeCampaign.algorandEscrow.appId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    View on Algorand Lora Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-400 block">Escrow App ID</span>
                    <span className="font-mono font-bold text-zinc-100 text-xs">
                      #{activeCampaign.algorandEscrow.appId}
                    </span>
                  </div>

                  <div className="rounded-lg bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-400 block">Locked Balance</span>
                    <span className="font-bold text-amber-400 text-xs">
                      {activeCampaign.algorandEscrow.lockedBalanceAlgo.toLocaleString()} ALGO
                    </span>
                  </div>

                  <div className="rounded-lg bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-400 block">Released Payouts</span>
                    <span className="font-bold text-emerald-400 text-xs">
                      {activeCampaign.algorandEscrow.releasedBalanceAlgo.toLocaleString()} ALGO
                    </span>
                  </div>
                </div>

                {/* Escrow Address */}
                <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2 text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-400 shrink-0">Escrow Address:</span>
                    <span className="font-mono text-emerald-300 truncate">
                      {activeCampaign.algorandEscrow.escrowAddress}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeCampaign.algorandEscrow.escrowAddress)}
                    className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    {copiedAddress === activeCampaign.algorandEscrow.escrowAddress ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Milestones Escrow Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Campaign Milestones & Automated Payout Pipeline
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Governed by Gemini AI Multimodal Oracle
                  </span>
                </div>

                <div className="space-y-3">
                  {activeCampaign.milestones.map((ms, index) => {
                    const isSubmitted = ms.status === 'submitted';
                    const isVerified = ms.status === 'verified';
                    const isReleased = ms.status === 'payout_released';

                    return (
                      <div
                        key={ms.id}
                        className={`rounded-xl border p-4.5 transition-all ${
                          isReleased
                            ? 'border-emerald-500/40 bg-emerald-950/10'
                            : isVerified
                            ? 'border-cyan-500/40 bg-cyan-950/10'
                            : isSubmitted
                            ? 'border-purple-500/40 bg-purple-950/10'
                            : 'border-zinc-800 bg-zinc-950/60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                                isReleased
                                  ? 'bg-emerald-500 text-zinc-950'
                                  : isVerified
                                  ? 'bg-cyan-500 text-zinc-950'
                                  : isSubmitted
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {isReleased ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-zinc-100">
                                  {ms.title}
                                </h4>
                                {isReleased && (
                                  <span className="rounded bg-emerald-500/20 px-2 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                                    PAYOUT RELEASED ON ALGORAND
                                  </span>
                                )}
                                {isVerified && (
                                  <span className="rounded bg-cyan-500/20 px-2 py-0.2 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                                    AI ORACLE VERIFIED
                                  </span>
                                )}
                                {isSubmitted && (
                                  <span className="rounded bg-purple-500/20 px-2 py-0.2 text-[9px] font-bold text-purple-300 border border-purple-500/30">
                                    DELIVERABLE SUBMITTED
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                                {ms.description}
                              </p>

                              {/* Metrics comparison bar */}
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
                                <div className="flex items-center gap-1 text-zinc-300">
                                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                  <span>
                                    Target: <strong>{ms.targetMetric.targetValue.toLocaleString()} {ms.targetMetric.unit}</strong>
                                  </span>
                                </div>
                                {ms.targetMetric.currentValue !== undefined && ms.targetMetric.currentValue > 0 && (
                                  <div className="flex items-center gap-1 text-emerald-400">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span>
                                      Verified Achieved: <strong>{ms.targetMetric.currentValue.toLocaleString()} {ms.targetMetric.unit}</strong>
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Deliverable link preview */}
                              {ms.submissionProof && (
                                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-zinc-300">
                                  <span className="text-zinc-400">Proof URL:</span>
                                  <a
                                    href={ms.submissionProof.deliverableUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-cyan-400 underline hover:text-cyan-300 truncate max-w-xs"
                                  >
                                    {ms.submissionProof.deliverableUrl}
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                </div>
                              )}

                              {/* Oracle verification reasoning */}
                              {ms.verificationResult && (
                                <div className="mt-2 rounded-lg bg-zinc-900/80 p-2 text-[11px] text-zinc-300 border border-zinc-800">
                                  <span className="font-semibold text-emerald-400">Gemini Oracle Verdict: </span>
                                  {ms.verificationResult.reasoning}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payout & Actions Column */}
                          <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                            <div className="sm:text-right">
                              <div className="text-sm font-extrabold text-emerald-400">
                                {ms.payoutAlgo.toLocaleString()} ALGO
                              </div>
                              <div className="text-[10px] text-zinc-400">
                                ≈ ${ms.payoutUsdApprox} USD
                              </div>
                            </div>

                            {/* Action Buttons based on status */}
                            <div className="flex items-center gap-2">
                              {ms.status === 'pending' && (
                                <button
                                  onClick={() => handleOpenSubmitModal(activeCampaign, ms)}
                                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                                >
                                  Submit Proof
                                </button>
                              )}

                              {ms.status === 'submitted' && (
                                <button
                                  onClick={() => handleVerifyMilestone(activeCampaign.id, ms.id)}
                                  disabled={isVerifying === ms.id}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-emerald-500 transition disabled:opacity-50"
                                >
                                  {isVerifying === ms.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Sparkles className="h-3 w-3" />
                                  )}
                                  Verify Milestone
                                </button>
                              )}

                              {ms.status === 'verified' && (
                                <button
                                  onClick={() => handleReleasePayout(activeCampaign.id, ms.id)}
                                  disabled={isReleasing === ms.id}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-[11px] font-bold text-zinc-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50"
                                >
                                  {isReleasing === ms.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-3 w-3" />
                                  )}
                                  Release {ms.payoutAlgo} ALGO
                                </button>
                              )}

                              {ms.status === 'payout_released' && (
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Settled On-Chain
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-400">
              Select a campaign on the left to inspect its Algorand Escrow Contract state.
            </div>
          )}
        </div>
      </div>

      {/* Submit Proof Modal */}
      {submissionMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Submit Milestone Proof</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{submissionMilestone.milestone.title}</p>
              </div>
              <button
                onClick={() => setSubmissionMilestone(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">Deliverable Post / Media URL</label>
                <input
                  type="text"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://x.com/creator/status/..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Target: {submissionMilestone.milestone.targetMetric.targetValue.toLocaleString()} {submissionMilestone.milestone.targetMetric.unit}
                </label>
                <input
                  type="number"
                  value={reportedViews}
                  onChange={(e) => setReportedViews(e.target.value)}
                  placeholder="Reported metric value"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">Submission Notes</label>
                <textarea
                  rows={3}
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSubmissionMilestone(null)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitProof}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Confirm Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
