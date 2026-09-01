import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Search, 
  Filter, 
  Coins, 
  ExternalLink, 
  Zap, 
  ArrowRight,
  Eye,
  Check,
  Send
} from 'lucide-react';
import { Creator, Campaign } from '../types';

interface CreatorDiscoveryProps {
  campaigns: Campaign[];
  onAssignCreatorToCampaign?: (creatorId: string, campaignId: string) => void;
}

export const CreatorDiscovery: React.FC<CreatorDiscoveryProps> = ({
  campaigns,
  onAssignCreatorToCampaign,
}) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [aiMatchingActive, setAiMatchingActive] = useState(false);
  const [matchedCreators, setMatchedCreators] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [offerSentCreatorId, setOfferSentCreatorId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/creators')
      .then(res => res.json())
      .then(data => {
        setCreators(data);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching creators:', err));
  }, []);

  const handleRunAiMatching = async () => {
    setAiMatchingActive(true);
    const camp = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
    
    try {
      const res = await fetch('/api/ai/match-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignTitle: camp?.title || 'Web3 Layer 2 Marketing',
          category: camp?.category || 'Web3 & Crypto',
          budgetAlgo: camp?.totalBudgetAlgo || 5000,
        }),
      });
      const data = await res.json();
      setMatchedCreators(data.matches || []);
    } catch (err) {
      console.error('Error matching creators:', err);
    }
  };

  const handleSendOffer = (creatorId: string) => {
    setOfferSentCreatorId(creatorId);
    setTimeout(() => setOfferSentCreatorId(null), 3000);
  };

  const displayList = matchedCreators.length > 0 ? matchedCreators : creators;

  const filteredCreators = displayList.filter(c => {
    const matchesNiche = selectedNiche === 'all' || c.primaryNiches?.some((n: string) => n.includes(selectedNiche));
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              AI Creator Marketplace & Matchmaker
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
            Discover verified creators with transparent on-chain escrow track records, Audience Quality Scores (AQS), and AI predictive ROI matching.
          </p>
        </div>

        {/* AI Matchmaker Trigger Box */}
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-2 text-xs">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                Match for: {c.title.substring(0, 25)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAiMatching}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3.5 py-1.5 font-bold text-zinc-950 shadow hover:from-emerald-400 hover:to-cyan-400 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Run Gemini Matchmaker
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Niche Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creator by name, bio, or niche..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Web3 & Crypto', 'Tech & AI', 'Gaming', 'Finance & Fintech', 'B2B SaaS'].map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedNiche === niche
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {niche === 'all' ? 'All Niches' : niche}
            </button>
          ))}
        </div>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredCreators.map((creator) => (
          <div
            key={creator.id}
            className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl transition hover:border-zinc-700 flex flex-col justify-between"
          >
            {/* Top Profile Bar */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />
                    {creator.verifiedBadge && (
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 shadow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-100 text-base">
                        {creator.name}
                      </h3>
                      <span className="text-xs text-zinc-400 font-mono">
                        {creator.handle}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        {creator.rating}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-emerald-400 font-medium">
                        {creator.completedCampaignsCount} Escrows Settled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Score Badge (if AI matching active) */}
                {creator.matchScore && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-2 text-right">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Gemini Match
                    </div>
                    <div className="text-lg font-black text-emerald-400">
                      {creator.matchScore}%
                    </div>
                  </div>
                )}
              </div>

              {/* Match Rationale / Fit Tag */}
              {creator.matchRationale && (
                <div className="mt-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-200 leading-relaxed">
                  <span className="font-semibold text-emerald-300">AI Match Rationale: </span>
                  {creator.matchRationale}
                </div>
              )}

              {/* Bio */}
              <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed">
                {creator.bio}
              </p>

              {/* Niches Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {creator.primaryNiches?.map((n: string) => (
                  <span
                    key={n}
                    className="rounded-md bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-zinc-800"
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Platform Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs">
                {creator.platforms?.youtube && (
                  <div className="rounded-xl bg-zinc-950 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">YouTube Subs</span>
                    <span className="font-bold text-zinc-100">
                      {(creator.platforms.youtube.subscribers / 1000).toFixed(0)}k
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      ~{(creator.platforms.youtube.avgViews / 1000).toFixed(0)}k views/video
                    </span>
                  </div>
                )}

                {creator.platforms?.tiktok && (
                  <div className="rounded-xl bg-zinc-950 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">TikTok Followers</span>
                    <span className="font-bold text-zinc-100">
                      {(creator.platforms.tiktok.followers / 1000).toFixed(0)}k
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      ~{(creator.platforms.tiktok.avgViews / 1000).toFixed(0)}k views
                    </span>
                  </div>
                )}

                {creator.platforms?.x && (
                  <div className="rounded-xl bg-zinc-950 p-2.5 border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block">X / Twitter</span>
                    <span className="font-bold text-zinc-100">
                      {(creator.platforms.x.followers / 1000).toFixed(0)}k
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      ~{(creator.platforms.x.avgImpressions / 1000).toFixed(0)}k impr
                    </span>
                  </div>
                )}
              </div>

              {/* Quality & On-Chain Trust Bar */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs border border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <div>
                    <span className="text-zinc-400 text-[10px] block">Audience Quality Score</span>
                    <span className="font-bold text-emerald-400">{creator.audienceQualityScore}/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] block">Escrow Success Rate</span>
                  <span className="font-bold text-zinc-100">{creator.escrowSuccessRate}%</span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] block">Total Earned</span>
                  <span className="font-bold text-cyan-400">{creator.totalEarnedAlgo.toLocaleString()} ALGO</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4 gap-3">
              <div className="truncate text-[11px] font-mono text-zinc-400">
                {creator.algorandAddress.substring(0, 6)}...{creator.algorandAddress.substring(creator.algorandAddress.length - 6)}
              </div>

              <button
                onClick={() => handleSendOffer(creator.id)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow ${
                  offerSentCreatorId === creator.id
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:from-emerald-400 hover:to-teal-400'
                }`}
              >
                {offerSentCreatorId === creator.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Escrow Proposal Dispatched!
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Algorand Escrow Offer
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
