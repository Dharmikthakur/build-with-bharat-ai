import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Terminal, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import { X402ServicePricing, X402PaymentReceipt, AlgorandWalletState } from '../types';

interface X402FacilitatorDashboardProps {
  wallet: AlgorandWalletState;
}

export const X402FacilitatorDashboard: React.FC<X402FacilitatorDashboardProps> = ({ wallet }) => {
  const [catalog, setCatalog] = useState<X402ServicePricing[]>([]);
  const [ledger, setLedger] = useState<X402PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive 402 Simulator State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv_ai_verify');
  const [simStep, setSimStep] = useState<'idle' | '402_challenged' | 'settling' | '200_unlocked'>('idle');
  const [raw402Header, setRaw402Header] = useState<string>('');
  const [rawResponseData, setRawResponseData] = useState<any | null>(null);

  const fetchLedgerAndCatalog = () => {
    Promise.all([
      fetch('/api/x402/catalog').then(r => r.json()),
      fetch('/api/x402/ledger').then(r => r.json()),
    ])
      .then(([cat, led]) => {
        setCatalog(cat);
        setLedger(led);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching x402 data:', err));
  };

  useEffect(() => {
    fetchLedgerAndCatalog();
  }, []);

  const handleTriggerUnpaidRequest = async () => {
    setSimStep('idle');
    setRawResponseData(null);
    const service = catalog.find(s => s.serviceId === selectedServiceId) || catalog[0];

    try {
      const res = await fetch('/api/x402/request-protected-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.serviceId,
          clientAddress: wallet.address,
        }),
      });

      const authHeader = res.headers.get('www-authenticate') || 
        `x402 realm="GoPlausible-Algorand", token="ALGO", price="${service.costAlgo}", payto="GOPLAUSIBLE77TESTNETFACILITATOR992841029384", nonce="nonce_${Date.now()}"`;
      
      const data = await res.json();
      setRaw402Header(authHeader);
      setRawResponseData(data);
      setSimStep('402_challenged');
    } catch (err) {
      console.error('Error simulating 402:', err);
    }
  };

  const handlePayAndSettle = async () => {
    setSimStep('settling');
    const service = catalog.find(s => s.serviceId === selectedServiceId) || catalog[0];

    try {
      await new Promise(r => setTimeout(r, 700));

      const res = await fetch('/api/x402/request-protected-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.serviceId,
          paymentSignature: 'SIG_ALGO_GOPLAUSIBLE_' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          clientAddress: wallet.address,
        }),
      });

      const data = await res.json();
      setRawResponseData(data);
      setSimStep('200_unlocked');
      fetchLedgerAndCatalog();
    } catch (err) {
      console.error('Error settling x402:', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              x402 GoPlausible Facilitator (Flow B)
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
            Machine-to-machine (M2M) pay-per-use micropayments on Algorand Testnet. AI agents and oracles pay fractional ALGO (0.01 - 0.05 ALGO) per API request via HTTP 402 challenge-response.
          </p>
        </div>

        <button
          onClick={fetchLedgerAndCatalog}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-cyan-500/40 hover:text-white transition shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
          Refresh Facilitator Ledger
        </button>
      </div>

      {/* Protocol Architecture Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-zinc-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-zinc-100 text-base">
            <Zap className="h-5 w-5 text-cyan-400" />
            How Flow B (x402 Protocol) Operates with GoPlausible Facilitator
          </div>
          <span className="rounded bg-cyan-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
            RFC HTTP 402 Standard
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">1. Protected Request</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Client or AI Agent requests verification, scraping, or decomposition without upfront subscription.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">2. HTTP 402 Challenge</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Server responds with <code className="text-amber-300">402 Payment Required</code> & price challenge header in ALGO.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">3. GoPlausible Settle</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              GoPlausible Facilitator verifies signed Algorand Testnet micro-transaction instantly.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">4. Data Unlocked</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Protected AI Oracle attestation and deliverable verification payload returned with cryptographic proof.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Left = Interactive Handshake Simulator, Right = Service Catalog */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Interactive Handshake Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                Interactive x402 Handshake & Settlement Simulator
              </h2>
              <span className="text-[11px] text-zinc-400">Live Testbed</span>
            </div>

            {/* Service selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Select Protected M2M API Endpoint:
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setSimStep('idle');
                  setRawResponseData(null);
                }}
                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
              >
                {catalog.map(s => (
                  <option key={s.serviceId} value={s.serviceId}>
                    {s.name} — {s.costAlgo} ALGO (${s.costUsdApprox})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 1 CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerUnpaidRequest}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
              >
                1. Send Unpaid Request (Trigger HTTP 402)
              </button>

              {simStep === '402_challenged' && (
                <button
                  onClick={handlePayAndSettle}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-emerald-400 transition"
                >
                  2. Settle Micropayment via GoPlausible
                </button>
              )}
            </div>

            {/* Terminal Output Viewer */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] border-b border-zinc-800 pb-2">
                <span>Protocol Exchange Log</span>
                <span>Algorand Testnet Node</span>
              </div>

              {simStep === 'idle' && !rawResponseData && (
                <div className="text-zinc-500 text-[11px] py-4 text-center">
                  Click "Send Unpaid Request" above to simulate an autonomous AI agent attempting to query the protected endpoint.
                </div>
              )}

              {simStep === '402_challenged' && (
                <div className="space-y-2 text-[11px]">
                  <div className="text-amber-400 font-bold">
                    HTTP/1.1 402 Payment Required
                  </div>
                  <div className="text-zinc-400 break-all">
                    <span className="text-cyan-400">WWW-Authenticate: </span>
                    {raw402Header}
                  </div>
                  <div className="text-zinc-300 bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
                    <span className="text-amber-400">Challenge Body: </span>
                    {JSON.stringify(rawResponseData, null, 2)}
                  </div>
                </div>
              )}

              {simStep === 'settling' && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs py-4">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Broadcasting micro-transaction to GoPlausible Facilitator on Algorand...
                </div>
              )}

              {simStep === '200_unlocked' && (
                <div className="space-y-2 text-[11px]">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    HTTP/1.1 200 OK — Payment Verified & Resource Released
                  </div>
                  <div className="text-zinc-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                    <span className="text-emerald-400">Verified Payload: </span>
                    {JSON.stringify(rawResponseData, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Service Catalog Pricing Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-400" />
                x402 Service Pricing Catalog
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">Pay-Per-Call</span>
            </div>

            <div className="space-y-3">
              {catalog.map((service) => (
                <div
                  key={service.serviceId}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 transition hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded bg-zinc-900 px-2 py-0.5 text-[9px] font-semibold text-cyan-400 border border-zinc-800">
                        {service.category}
                      </span>
                      <h4 className="mt-1 text-xs font-bold text-zinc-100">
                        {service.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400">
                        {service.costAlgo} ALGO
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        ≈ ${service.costUsdApprox}
                      </div>
                    </div>
                  </div>

                  <p className="mt-1.5 text-[11px] text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-1.5">
                    <span>Avg Latency: ~{service.latencyMs}ms</span>
                    <span className="text-cyan-400 font-mono">GoPlausible Settled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Section: Live On-Chain x402 Micropayment Ledger */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm">
            <Database className="h-4 w-4 text-cyan-400" />
            Live GoPlausible Facilitator Settlement Ledger ({ledger.length} Transactions)
          </div>
          <span className="text-xs text-zinc-400">
            Real-Time Algorand Testnet Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Caller / Escrow</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Facilitator</th>
                <th className="pb-3 font-medium">Algorand Tx ID</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {ledger.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-950/40">
                  <td className="py-3 font-medium text-zinc-100 max-w-xs truncate">
                    {tx.serviceName}
                  </td>
                  <td className="py-3 font-mono text-zinc-400">
                    {tx.callerAddress.substring(0, 8)}...{tx.callerAddress.substring(tx.callerAddress.length - 6)}
                  </td>
                  <td className="py-3 font-bold text-emerald-400">
                    {tx.amountAlgo} ALGO
                  </td>
                  <td className="py-3 text-zinc-400 text-[11px]">
                    {tx.facilitator}
                  </td>
                  <td className="py-3 font-mono text-cyan-400">
                    <a
                      href={`https://lora.algokit.io/testnet/transaction/${tx.algorandTxId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline truncate max-w-[140px]"
                    >
                      {tx.algorandTxId.substring(0, 14)}...
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      SETTLED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
