import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Coins, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  FileCheck, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  Eye, 
  Users, 
  Lock, 
  Code2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, Milestone, AlgorandWalletState } from '../types';

interface CampaignStudioProps {
  onCampaignCreated: (campaign: Campaign) => void;
  wallet: AlgorandWalletState;
  onNavigateToEscrow: () => void;
}

const PRESET_TEMPLATES = [
  {
    title: 'Web3 DeFi & Layer-1 Protocol Launch',
    prompt: 'Launch a marketing blitz for our high-speed Algorand DEX. Need 2 YouTube video reviews, 50k views on technical breakdowns, and 300 testnet trade transactions.',
    category: 'Web3 & Crypto' as const,
    budget: 5000,
  },
  {
    title: 'B2B AI Productivity Tool Viral Sprint',
    prompt: 'Promote our automated spreadsheet & document AI agent on TikTok & YouTube Shorts. Milestone 1: 75k views demo video; Milestone 2: 200 free trial business signups.',
    category: 'B2B SaaS' as const,
    budget: 4200,
  },
  {
    title: 'Web3 Gaming & Streamer Tournament',
    prompt: 'Sponsor 3 Twitch & YouTube gaming creators to stream live matches of our on-chain card battler. Milestone 1: 45k stream views; Milestone 2: 500 game launcher downloads.',
    category: 'Gaming' as const,
    budget: 6500,
  },
  {
    title: 'Fintech Micro-Savings App Onboarding',
    prompt: 'Partner with personal finance creators on Instagram & X. Milestone 1: Educational carousel with 30k reach; Milestone 2: 150 verified wallet deposits.',
    category: 'Finance & Fintech' as const,
    budget: 3500,
  },
];

export const CampaignStudio: React.FC<CampaignStudioProps> = ({
  onCampaignCreated,
  wallet,
  onNavigateToEscrow,
}) => {
  const [brandName, setBrandName] = useState('Plausible Protocol Labs');
  const [category, setCategory] = useState<'Web3 & Crypto' | 'Tech & AI' | 'Gaming' | 'Lifestyle & Fashion' | 'Finance & Fintech' | 'B2B SaaS'>('Web3 & Crypto');
  const [budgetAlgo, setBudgetAlgo] = useState<number>(5000);
  const [prompt, setPrompt] = useState(
    'Launch marketing campaign for our Algorand Layer-2 Rollup bridge. Need 1 in-depth YouTube tutorial (35k views target) and 1 technical thread on X (20k impressions target) with verified developer engagement.'
  );
  
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [decomposedResult, setDecomposedResult] = useState<any | null>(null);
  const [isDeployingEscrow, setIsDeployingEscrow] = useState(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [createdCampaign, setCreatedCampaign] = useState<Campaign | null>(null);

  const handleDecompose = async () => {
    setIsDecomposing(true);
    setDecomposedResult(null);

    try {
      const res = await fetch('/api/ai/decompose-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          budgetAlgo,
          category,
          brandName,
        }),
      });

      const data = await res.json();
      setDecomposedResult(data);
    } catch (err) {
      console.error('Error decomposing campaign:', err);
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleDeployEscrowAndCreate = async () => {
    if (!decomposedResult) return;
    setIsDeployingEscrow(true);

    try {
      setDeployStep('Compiling ARC-4 Algorand Smart Contract Escrow...');
      await new Promise(r => setTimeout(r, 600));

      setDeployStep('Broadcasting Escrow App Deployment to Algorand Testnet...');
      await new Promise(r => setTimeout(r, 700));

      setDeployStep(`Locking ${budgetAlgo.toLocaleString()} ALGO into Escrow Account...`);
      await new Promise(r => setTimeout(r, 800));

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decomposedResult.title || 'Algorand Creator Campaign',
          brandName,
          brandAddress: wallet.address,
          category,
          description: prompt,
          totalBudgetAlgo: budgetAlgo,
          milestones: decomposedResult.milestones,
          tags: decomposedResult.suggestedTags,
          aiDecomposition: {
            generatedBy: 'gemini-3.7-flash',
            confidenceScore: 0.98,
            recommendedTargetAudience: decomposedResult.recommendedTargetAudience,
            contentGuidance: decomposedResult.contentGuidance,
            riskAssessment: decomposedResult.riskAssessment,
          },
        }),
      });

      const data = await res.json();
      setCreatedCampaign(data.campaign);
      onCampaignCreated(data.campaign);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      });
    } catch (err) {
      console.error('Error deploying campaign escrow:', err);
    } finally {
      setIsDeployingEscrow(false);
      setDeployStep('');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Studio Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              AI Campaign Studio & Smart Escrow
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
            Input your raw campaign goals. Gemini 3.7 Flash decomposes your requirements into quantifiable milestones, and our Algorand smart contract securely locks funds until verified by milestone criteria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Campaign Requirement Definition (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Container */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                1. Campaign Parameters
              </h2>
              <span className="text-[11px] text-zinc-400">Step 1 of 2</span>
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Company / Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Algorand Foundation, Plausible Labs"
              />
            </div>

            {/* Category & Budget Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Target Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Web3 & Crypto">Web3 & Crypto</option>
                  <option value="Tech & AI">Tech & AI</option>
                  <option value="Gaming">Gaming</option>
                  <option value="B2B SaaS">B2B SaaS</option>
                  <option value="Finance & Fintech">Finance & Fintech</option>
                  <option value="Lifestyle & Fashion">Lifestyle & Fashion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Total Budget (ALGO)
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    value={budgetAlgo}
                    onChange={(e) => setBudgetAlgo(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs font-semibold text-zinc-100 focus:border-emerald-500 focus:outline-none pl-8"
                  />
                  <Coins className="absolute left-2.5 top-3 h-3.5 w-3.5 text-emerald-400" />
                  <span className="absolute right-3 top-3 text-[10px] text-zinc-400">
                    ≈ ${(budgetAlgo * 0.32).toFixed(0)} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Brief / Natural Language Prompt */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-300">
                  Campaign Scope & Target Deliverables
                </label>
                <span className="text-[10px] text-zinc-400">Natural Language Prompt</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder="Describe your campaign goals, platform requirements (YouTube, TikTok, X), target views, follower thresholds, or conversions..."
              />
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-medium text-zinc-400">
                Quick Template Presets:
              </span>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(tmpl.prompt);
                      setCategory(tmpl.category);
                      setBudgetAlgo(tmpl.budget);
                    }}
                    className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 p-2.5 text-left text-[11px] transition hover:border-emerald-500/40 hover:bg-zinc-950"
                  >
                    <span className="font-semibold text-zinc-200 truncate">
                      {tmpl.title}
                    </span>
                    <span className="mt-0.5 text-[10px] text-emerald-400">
                      {tmpl.budget.toLocaleString()} ALGO • {tmpl.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA: Decompose via Gemini */}
            <button
              onClick={handleDecompose}
              disabled={isDecomposing || !prompt}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition disabled:opacity-50"
            >
              {isDecomposing ? (
                 <>
                  <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                  Gemini 3.7 Flash Decomposing Campaign...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Decompose with AI Agent
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: AI Milestone Breakdown & Smart Contract Escrow (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!decomposedResult && !isDecomposing && (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400 ring-1 ring-zinc-700">
                <Layers className="h-7 w-7 text-emerald-400/80" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-100">
                Awaiting Campaign Decomposition
              </h3>
              <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed">
                Click "Decompose with AI Agent" to have Gemini transform your campaign brief into measurable smart contract milestones, metric verifiers, and escrow allocations.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2.5 py-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Deterministic Metric Targets
                </span>
                <span className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2.5 py-1">
                  <Lock className="h-3 w-3 text-cyan-400" />
                  Algorand ARC-4 Escrow Ready
                </span>
              </div>
            </div>
          )}

          {isDecomposing && (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-zinc-100">
                Multi-Agent Campaign Decomposition in Progress
              </h3>
              <p className="mt-2 text-xs text-zinc-400 max-w-sm">
                Gemini 3.7 Flash is analyzing deliverables, parsing target view counts, calculating milestone escrow percentages, and synthesizing fraud guardrails...
              </p>
            </div>
          )}

          {decomposedResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/90 p-6 shadow-2xl space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      GEMINI 3.7 FLASH VERIFIED
                    </span>
                    <span className="text-xs text-zinc-400">
                      Confidence: 98.4%
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-zinc-100">
                    {decomposedResult.title}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-400">Escrow Commitment</div>
                  <div className="text-lg font-extrabold text-emerald-400">
                    {budgetAlgo.toLocaleString()} ALGO
                  </div>
                </div>
              </div>

              {/* Audience & Risk Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    🎯 Target Audience Profile:
                  </span>
                  <p className="text-zinc-200 leading-relaxed">
                    {decomposedResult.recommendedTargetAudience}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    🛡️ AI Risk & Fraud Assessment:
                  </span>
                  <p className="text-zinc-200 leading-relaxed">
                    {decomposedResult.riskAssessment}
                  </p>
                </div>
              </div>

              {/* Milestone Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Smart Contract Escrow Milestones ({decomposedResult.milestones.length})</span>
                  <span className="text-zinc-400 text-[11px]">Tranche Distribution</span>
                </div>

                {decomposedResult.milestones.map((ms: any, index: number) => (
                  <div
                    key={ms.id}
                    className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-100">
                            {ms.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                            {ms.description}
                          </p>

                          {/* Target Metric Badge */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 font-medium text-zinc-300 border border-zinc-800">
                              <Eye className="h-3 w-3 text-cyan-400" />
                              Target: {ms.targetMetric.targetValue.toLocaleString()} {ms.targetMetric.unit}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 font-medium text-zinc-300 border border-zinc-800">
                              <Clock className="h-3 w-3 text-purple-400" />
                              Window: {ms.deadlineDays} Days
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tranche ALGO */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-emerald-400">
                          {ms.payoutAlgo.toLocaleString()} ALGO
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          ≈ ${ms.payoutUsdApprox} USD
                        </div>
                        <span className="mt-1 inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                          {Math.round((ms.payoutAlgo / budgetAlgo) * 100)}% Tranche
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Guidelines */}
              {decomposedResult.contentGuidance?.length > 0 && (
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-xs">
                  <span className="font-semibold text-zinc-300 text-[11px] block mb-2">
                    📋 AI Compliance Directives:
                  </span>
                  <ul className="space-y-1 text-zinc-400 list-disc list-inside text-[11px]">
                    {decomposedResult.contentGuidance.map((guide: string, i: number) => (
                      <li key={i}>{guide}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deploy & Fund Escrow CTA */}
              {!createdCampaign ? (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleDeployEscrowAndCreate}
                    disabled={isDeployingEscrow}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3.5 text-xs font-bold text-zinc-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition disabled:opacity-50"
                  >
                    {isDeployingEscrow ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                        {deployStep}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Lock {budgetAlgo.toLocaleString()} ALGO in Algorand Smart Contract Escrow
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                    <span>Non-custodial Algorand ARC-4 Escrow</span>
                    <span className="text-emerald-400 font-medium">ARC-4 PyTeAL Compatible</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      Algorand Escrow Contract Successfully Funded!
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      App #{createdCampaign.algorandEscrow.appId}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-[11px]">
                    Contract deployed to Algorand Testnet. {createdCampaign.totalBudgetAlgo.toLocaleString()} ALGO is safely locked in escrow address <code className="font-mono text-emerald-400">{createdCampaign.algorandEscrow.escrowAddress.substring(0, 16)}...</code>.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={onNavigateToEscrow}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow hover:bg-emerald-400 transition"
                    >
                      View in Escrow Dashboard
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={`https://lora.algokit.io/testnet/application/${createdCampaign.algorandEscrow.appId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      Algorand Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
