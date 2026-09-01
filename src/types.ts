export type CampaignStatus = 'draft' | 'funding_pending' | 'escrow_locked' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';

export type MilestoneStatus = 'pending' | 'submitted' | 'ai_verifying' | 'verified' | 'payout_released' | 'rejected';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetMetric: {
    type: 'views' | 'likes' | 'engagement_rate' | 'conversions' | 'deliverable_post';
    targetValue: number;
    currentValue?: number;
    unit: string;
  };
  payoutAlgo: number;
  payoutUsdApprox: number;
  deadlineDays: number;
  status: MilestoneStatus;
  submissionProof?: {
    deliverableUrl?: string;
    mediaUrl?: string;
    notes?: string;
    submittedAt?: string;
    reportedViews?: number;
    reportedEngagement?: number;
  };
  verificationResult?: {
    verifiedAt: string;
    aiScore: number;
    passed: boolean;
    confidence: number;
    reasoning: string;
    verifiedViews?: number;
    authenticityScore?: number;
    brandSafetyScore?: number;
    algorandTxId?: string;
    x402CostAlgo?: number;
  };
}

export interface Campaign {
  id: string;
  title: string;
  brandName: string;
  brandAddress: string;
  category: 'Web3 & Crypto' | 'Tech & AI' | 'Gaming' | 'Lifestyle & Fashion' | 'Finance & Fintech' | 'B2B SaaS';
  description: string;
  totalBudgetAlgo: number;
  currency: 'ALGO' | 'USDCa';
  assignedCreatorId?: string;
  assignedCreatorName?: string;
  assignedCreatorAvatar?: string;
  assignedCreatorAddress?: string;
  status: CampaignStatus;
  createdAt: string;
  milestones: Milestone[];
  // Flow A: Algorand Escrow Contract metadata
  algorandEscrow: {
    appId: number;
    escrowAddress: string;
    fundingTxId?: string;
    isFunded: boolean;
    lockedBalanceAlgo: number;
    releasedBalanceAlgo: number;
    refundBalanceAlgo: number;
    contractVersion: string;
  };
  // AI metadata
  aiDecomposition: {
    generatedBy: 'gemini-3.7-flash';
    confidenceScore: number;
    recommendedTargetAudience: string;
    contentGuidance: string[];
    riskAssessment: string;
  };
  tags: string[];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  algorandAddress: string;
  primaryNiches: string[];
  platforms: {
    youtube?: { handle: string; subscribers: number; avgViews: number };
    tiktok?: { handle: string; followers: number; avgViews: number };
    x?: { handle: string; followers: number; avgImpressions: number };
    instagram?: { handle: string; followers: number; engagementRate: number };
  };
  audienceQualityScore: number; // 0 - 100
  fraudRiskScore: number; // Low, Medium, High
  escrowSuccessRate: number; // 0 - 100%
  completedCampaignsCount: number;
  totalEarnedAlgo: number;
  rating: number;
  verifiedBadge: boolean;
}

export interface X402ServicePricing {
  serviceId: string;
  name: string;
  description: string;
  costAlgo: number;
  costUsdApprox: number;
  category: 'AI Verification' | 'Anti-Fraud' | 'Metric Scraper' | 'Agent Orchestration';
  latencyMs: number;
}

export interface X402PaymentReceipt {
  id: string;
  serviceId: string;
  serviceName: string;
  callerAddress: string;
  facilitator: string; // 'GoPlausible Algorand Testnet'
  amountAlgo: number;
  timestamp: string;
  algorandTxId: string;
  status: 'settled' | 'pending' | 'failed';
  resourceAccessed: string;
  proofNonce: string;
}

export interface PlatformStats {
  totalEscrowLockedAlgo: number;
  totalPayoutsReleasedAlgo: number;
  activeCampaignsCount: number;
  x402TransactionsCount: number;
  verifiedCreatorsCount: number;
  aiOraclesOnlineCount: number;
}

export interface AlgorandWalletState {
  isConnected: boolean;
  address: string;
  network: 'Testnet' | 'Mainnet';
  balanceAlgo: number;
  balanceUsd?: number;
  walletType?: string;
  walletProvider?: 'Pera Wallet' | 'Defly' | 'Kibisis' | 'AlgoSigner' | 'Testnet Simulated';
}
