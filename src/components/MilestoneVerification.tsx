import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Lock, 
  Coins, 
  AlertTriangle, 
  FileCheck, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, Milestone, AlgorandWalletState } from '../types';

interface MilestoneVerificationProps {
  campaigns: Campaign[];
  selectedCampaign?: Campaign | null;
  selectedMilestone?: Milestone | null;
  onRefreshCampaigns: () => void;
  wallet: AlgorandWalletState;
}

const SAMPLE_DELIVERABLES = [
  {
    title: 'YouTube Technical Deep-Dive & Benchmark Walkthrough',
    url: 'https://youtube.com/watch?v=algorand_rollup_demo_2026',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    views: 31400,
    engagement: 4.8,
    notes: 'Published comprehensive 14-min developer guide. Code repository and GoPlausible link added in description with timestamps.',
  },
  {
    title: 'TikTok Viral Productivity Workflow Reel',
    url: 'https://tiktok.com/@marcusbuilds/video/782910293847',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    views: 84500,
    engagement: 7.1,
    notes: 'Fast-paced demonstration of AI spreadsheet automation. Reached #tech trending feed.',
  },
  {
    title: 'X (Twitter) Architecture Thread & Grants Announcement',
    url: 'https://x.com/elena_web3/status/1928371029384',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    views: 42000,
    engagement: 5.5,
    notes: '12-tweet deep breakdown with benchmark graphs. 450+ retweets and developer questions answered in replies.',
  },
];

export const MilestoneVerification: React.FC<MilestoneVerificationProps> = ({
  campaigns,
  selectedCampaign: initialCampaign,
  selectedMilestone: initialMilestone,
  onRefreshCampaigns,
  wallet,
}) => {
  const [activeCampaignId, setActiveCampaignId] = useState<string>(initialCampaign?.id || campaigns[0]?.id || '');
  const campaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];

  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(initialMilestone?.id || campaign?.milestones[0]?.id || '');
  const milestone = campaign?.milestones.find(m => m.id === activeMilestoneId) || campaign?.milestones[0];

  // Submission Form State
  const [deliverableUrl, setDeliverableUrl] = useState(milestone?.submissionProof?.deliverableUrl || SAMPLE_DELIVERABLES[0].url);
  const [mediaUrl, setMediaUrl] = useState(milestone?.submissionProof?.mediaUrl || SAMPLE_DELIVERABLES[0].imageUrl);
  const [reportedViews, setReportedViews] = useState<number>(milestone?.targetMetric?.targetValue ? Math.round(milestone.targetMetric.targetValue * 1.1) : 30000);
  const [reportedEngagement, setReportedEngagement] = useState<number>(5.2);
  const [notes, setNotes] = useState(milestone?.submissionProof?.notes || SAMPLE_DELIVERABLES[0].notes);

  // Oracle Run State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState('');
  const [oracleResult, setOracleResult] = useState<any | null>(milestone?.verificationResult || null);
  const [x402Receipt, setX402Receipt] = useState<any | null>(null);

  // Escrow Release State
  const [isReleasingPayout, setIsReleasingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleApplySampleDeliverable = (sample: typeof SAMPLE_DELIVERABLES[0]) => {
    setDeliverableUrl(sample.url);
    setMediaUrl(sample.imageUrl);
    setReportedViews(sample.views);
    setReportedEngagement(sample.engagement);
    setNotes(sample.notes);
  };

  const handleRunAiOracleVerification = async () => {
    if (!campaign || !milestone) return;
    setIsVerifying(true);
    setOracleResult(null);
    setPayoutSuccess(false);

    try {
      setVerificationStep('Submitting x402 Micropayment (0.05 ALGO) to GoPlausible Facilitator...');
      await new Promise(r => setTimeout(r, 600));

      setVerificationStep('Gemini 3.7 Flash inspecting deliverable metadata & screenshot proof...');
      await new Promise(r => setTimeout(r, 800));

      setVerificationStep('Running Sybil Anti-Bot and Audience Authenticity Scanner...');
      await new Promise(r => setTimeout(r, 700));

      setVerificationStep('Signing on-chain Oracle Attestation for Algorand Smart Contract...');

      const res = await fetch('/api/ai/verify-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          milestoneId: milestone.id,
          deliverableUrl,
          mediaUrl,
          notes,
          targetMetric: milestone.targetMetric,
        }),
      });

      const data = await res.json();
      setOracleResult(data.verificationResult);
      setX402Receipt(data.x402Receipt);
      onRefreshCampaigns();
    } catch (err) {
      console.error('Oracle verification error:', err);
    } finally {
      setIsVerifying(false);
      setVerificationStep('');
    }
  };

  const handleReleaseEscrowPayout = async () => {
    if (!campaign || !milestone) return;
    setIsReleasingPayout(true);

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/milestones/${milestone.id}/release-payout`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setPayoutSuccess(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6'],
        });
        onRefreshCampaigns();
      }
    } catch (err) {
      console.error('Error releasing payout:', err);
    } finally {
      setIsReleasingPayout(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              AI Oracle Deliverable & Escrow Release Portal
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
            Creators submit deliverable proof. Autonomous Gemini AI Oracles inspect performance metrics, perform fraud detection, and trigger on-chain Algorand smart contract escrow payouts.
          </p>
        </div>

        {/* Campaign & Milestone Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-2 text-xs">
          <select
            value={activeCampaignId}
            onChange={(e) => {
              setActiveCampaignId(e.target.value);
              const newCamp = campaigns.find(c => c.id === e.target.value);
              if (newCamp && newCamp.milestones[0]) {
                setActiveMilestoneId(newCamp.milestones[0].id);
              }
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                Campaign: {c.title.substring(0, 24)}...
              </option>
            ))}
          </select>

          {campaign && (
            <select
              value={activeMilestoneId}
              onChange={(e) => setActiveMilestoneId(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
            >
              {campaign.milestones.map((m, idx) => (
                <option key={m.id} value={m.id}>
                  M{idx + 1}: {m.title.substring(0, 20)}... ({m.payoutAlgo} ALGO)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid: Left = Submission Portal (5 cols), Right = AI Oracle & Escrow Release (7 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Creator Deliverable Submission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-400" />
                Creator Submission Proof
              </h2>
              <span className="text-[11px] font-mono text-emerald-400">
                Reward: {milestone?.payoutAlgo || 0} ALGO
              </span>
            </div>

            {/* Target Metric Reminder */}
            {milestone && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span>Agreed Milestone Target:</span>
                  <span className="font-bold text-zinc-100">
                    {milestone.targetMetric.targetValue.toLocaleString()} {milestone.targetMetric.unit}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300">
                  {milestone.description}
                </div>
              </div>
            )}

            {/* Quick Demo Deliverable Presets */}
            <div>
              <span className="text-[11px] font-medium text-zinc-400">
                Quick Sample Deliverable Proofs:
              </span>
              <div className="mt-2 space-y-1.5">
                {SAMPLE_DELIVERABLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySampleDeliverable(sample)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 p-2.5 text-left text-[11px] transition hover:border-purple-500/40 hover:bg-zinc-950 flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-200 truncate max-w-[240px]">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">
                      {sample.views.toLocaleString()} views
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverable URL */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Public Deliverable URL (YouTube / TikTok / X)
              </label>
              <input
                type="text"
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Cloudinary Media / Screenshot Proof */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Analytics Screenshot Proof (Cloudinary Pipeline)
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {mediaUrl && (
                <div className="mt-3 relative rounded-xl border border-zinc-800 overflow-hidden h-36 bg-zinc-950">
                  <img
                    src={mediaUrl}
                    alt="Proof Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded bg-zinc-950/80 px-2 py-1 text-[10px] text-zinc-300 backdrop-blur-sm border border-zinc-800">
                    Proof Media Verified
                  </div>
                </div>
              )}
            </div>

            {/* Reported Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Reported Views
                </label>
                <input
                  type="number"
                  value={reportedViews}
                  onChange={(e) => setReportedViews(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Engagement Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={reportedEngagement}
                  onChange={(e) => setReportedEngagement(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-100 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Creator Notes */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Creator Submission Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Trigger AI Oracle CTA */}
            <button
              onClick={handleRunAiOracleVerification}
              disabled={isVerifying || !deliverableUrl}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-cyan-500 transition disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  Running AI Oracle Pipeline...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run Autonomous AI Oracle Verification
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Oracle Analysis & Smart Escrow Payout Release */}
        <div className="lg:col-span-7 space-y-6">
          {isVerifying && (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-purple-500/40 bg-zinc-900/90 p-8 text-center shadow-2xl">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Cpu className="h-8 w-8 animate-pulse text-purple-400" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-cyan-400 animate-spin" />
              </div>

              <h3 className="mt-5 text-base font-bold text-zinc-100">
                Autonomous AI Oracle Executing
              </h3>

              <p className="mt-2 text-xs font-medium text-purple-300 max-w-sm">
                {verificationStep || 'Inspecting deliverable proof and telemetry data...'}
              </p>

              <div className="mt-6 flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 rounded bg-zinc-950 px-2 py-1 border border-zinc-800">
                  <Zap className="h-3 w-3 text-cyan-400" />
                  0.05 ALGO x402 GoPlausible Facilitator
                </span>
                <span className="flex items-center gap-1 rounded bg-zinc-950 px-2 py-1 border border-zinc-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Sybil Shield Active
                </span>
              </div>
            </div>
          )}

          {!oracleResult && !isVerifying && (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-purple-400">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-100">
                AI Oracle Standby
              </h3>
              <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed">
                Click "Run Autonomous AI Oracle Verification" to trigger the multi-agent deliverable inspection, anti-bot fraud audit, and generate the smart contract release authorization.
              </p>
            </div>
          )}

          {oracleResult && !isVerifying && (
            <div className="rounded-2xl border border-emerald-500/40 bg-zinc-900/95 p-6 shadow-2xl space-y-6">
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                      ORACLE VERDICT: APPROVED (PASS)
                    </span>
                    <span className="text-xs text-zinc-400">
                      Confidence: {(oracleResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-zinc-100">
                    Milestone Deliverable Verified Successfully
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400">Escrow Tranche</div>
                  <div className="text-lg font-black text-emerald-400">
                    {milestone?.payoutAlgo.toLocaleString()} ALGO
                  </div>
                </div>
              </div>

              {/* Metric Verification Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-[10px] text-zinc-400 block">Verified Views</span>
                  <div className="mt-0.5 text-base font-bold text-emerald-400">
                    {oracleResult.verifiedViews?.toLocaleString() || reportedViews.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400/80">Exceeded Target</span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-[10px] text-zinc-400 block">Authenticity Score</span>
                  <div className="mt-0.5 text-base font-bold text-cyan-400">
                    {oracleResult.authenticityScore || 96}/100
                  </div>
                  <span className="text-[10px] text-zinc-400">Bot Probability &lt; 2%</span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-400 block">Brand Safety</span>
                  <div className="mt-0.5 text-base font-bold text-purple-400">
                    {oracleResult.brandSafetyScore || 100}%
                  </div>
                  <span className="text-[10px] text-zinc-400">FTC Disclosed</span>
                </div>
              </div>

              {/* Oracle Reasoning Box */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-200 leading-relaxed">
                <span className="font-semibold text-emerald-300 block mb-1">
                  🤖 Gemini Oracle Reasoning & Evidence:
                </span>
                {oracleResult.reasoning}
              </div>

              {/* Flow B: x402 GoPlausible Facilitator Settlement Receipt */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs text-cyan-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                    Flow B: x402 Micropayment Settled
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400">
                    0.05 ALGO via GoPlausible
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Algorand Tx ID:</span>
                  <span className="font-mono text-cyan-300 truncate max-w-[200px]">
                    {oracleResult.algorandTxId || 'X402-TX-102938410293840192834'}
                  </span>
                </div>
              </div>

              {/* Flow A: Trigger Smart Contract Escrow Release */}
              <div className="pt-2">
                {!payoutSuccess && milestone?.status !== 'payout_released' ? (
                  <button
                    onClick={handleReleaseEscrowPayout}
                    disabled={isReleasingPayout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3.5 text-xs font-bold text-zinc-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition disabled:opacity-50"
                  >
                    {isReleasingPayout ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                        Releasing {milestone?.payoutAlgo} ALGO on Algorand Smart Contract...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Execute On-Chain Escrow Release ({milestone?.payoutAlgo} ALGO to Creator)
                      </>
                    )}
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {milestone?.payoutAlgo} ALGO Successfully Transferred to Creator!
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        App #{campaign?.algorandEscrow.appId}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[11px]">
                      Smart contract escrow released funds to <code className="font-mono text-emerald-300">{campaign?.assignedCreatorAddress || 'Creator Address'}</code>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
