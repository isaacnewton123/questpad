import { useState } from "react";
import { PiArrowLeft, PiPersonSimpleRun, PiTicket, PiChartBar, PiCheck, PiArrowRight } from "react-icons/pi";
import { useParams, useNavigate } from "react-router-dom";
import StepCard from "../components/StepCard";
import CountdownBadge from "../components/CountdownBadge";
import RewardBadge from "../components/RewardBadge";
import ProofModal from "../components/ProofModal";
import {
  useCampaignDetail,
  type Step, type Campaign,
} from "../hooks/useCampaignDetail";

export default function CampaignDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useCampaignDetail(id);
  const [proofStep, setProofStep] = useState<Step | null>(null);

  function handleStartPassive(stepId: string) {
    const step = state.steps.find((s) => s.id === stepId);
    if (step) setProofStep(step);
  }

  async function handleProofSubmit(proof: string) {
    if (!proofStep) return;
    await state.submitProof(proofStep.id, proof);
    setProofStep(null);
  }

  if (state.loading) return <LoadingView />;
  if (!state.campaign) return <NotFoundView />;

  const canClaim = state.allDone && !state.claimed;

  return (
    <div className="pb-nav max-w-md mx-auto">
      <div className="bg-animated" />
      <Header
        campaign={state.campaign}
        onBack={() => navigate("/campaigns")}
      />
      <div className="px-4 space-y-4 mt-4">
        <MetadataBar campaign={state.campaign} />
        <StepList
          steps={state.steps}
          completions={state.completions}
          onVerify={state.handleVerify}
          onStart={handleStartPassive}
        />
        <ClaimSection
          campaign={state.campaign}
          canClaim={canClaim}
          claimed={state.claimed}
          claiming={state.claiming}
          onClaim={state.handleClaim}
        />
      </div>
      {proofStep && (
        <ProofModal
          taskType={proofStep.task_type}
          onSubmit={handleProofSubmit}
          onClose={() => setProofStep(null)}
        />
      )}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh">
      <div className="bg-animated" />
      <div className="w-10 h-10 rounded-full border-3 border-slate-200
        border-t-blue-500 animate-spin" />
    </div>
  );
}

function NotFoundView() {
  return (
    <div className="p-8 text-center">
      <div className="bg-animated" />
      <p className="text-slate-500">Campaign not found.</p>
    </div>
  );
}

function Header({ campaign, onBack }: {
  campaign: Campaign; onBack: () => void;
}) {
  return (
    <div className="px-4 pt-4">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 font-semibold mb-3 flex items-center gap-1
          active:scale-95 transition-transform"
      >
        <PiArrowLeft /> Back
      </button>
      <h1 className="text-xl font-bold text-gradient">
        {campaign.title}
      </h1>
      {campaign.description && (
        <p className="text-sm text-slate-500 mt-1">
          {campaign.description}
        </p>
      )}
    </div>
  );
}

function MetadataBar({ campaign }: { campaign: Campaign }) {
  return (
    <div className="glass-panel p-3 flex flex-wrap items-center gap-2">
      {campaign.campaign_type === "fcfs" && (
        <span className="badge-fcfs flex items-center gap-1">
          <PiPersonSimpleRun /> {campaign.current_completions}/{campaign.max_completions}
        </span>
      )}
      {campaign.campaign_type === "raffle" && (
        <span className="badge-raffle flex items-center gap-1"><PiTicket /> Raffle</span>
      )}
      <span className="text-[11px] text-slate-400 flex items-center gap-1">
        <PiChartBar /> {campaign.participant_count} joined
      </span>
      {campaign.expires_at && (
        <CountdownBadge expiresAt={campaign.expires_at} />
      )}
      {campaign.reward_pool > 0 && (
        <span className="text-[11px] font-semibold text-blue-500">
          Pool: {Number(campaign.reward_pool)} TON
        </span>
      )}
    </div>
  );
}

function StepList({ steps, completions, onVerify, onStart }: {
  steps: Step[];
  completions: Record<string, { status: string }>;
  onVerify: (id: string) => void;
  onStart: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
        Tasks
      </h2>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            index={i}
            step={step}
            status={completions[step.id]?.status}
            onVerify={onVerify}
            onStart={onStart}
          />
        ))}
      </div>
    </section>
  );
}

function ClaimSection({ campaign, canClaim, claimed, claiming, onClaim }: {
  campaign: Campaign;
  canClaim: boolean;
  claimed: boolean;
  claiming: boolean;
  onClaim: () => void;
}) {
  const btnClass = claimed
    ? "bg-emerald-50 text-emerald-600"
    : canClaim
      ? "bg-slate-900 text-white active:scale-[0.98]"
      : "bg-slate-100 text-slate-400";

  const btnLabel = claimed
    ? <span className="flex items-center justify-center gap-1"><PiCheck /> Reward Claimed</span>
    : claiming ? "Claiming..." : "Claim Reward";

  return (
    <section className="glass-panel p-4 text-center">
      <p className="text-xs text-slate-500 mb-2">Reward</p>
      <div className="flex items-center justify-center gap-1 mb-4">
        <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Complete all tasks <PiArrowRight />
        </span>
        <RewardBadge type={campaign.reward_type} value={campaign.reward_value} />
      </div>
      <button
        onClick={onClaim}
        disabled={!canClaim || claiming}
        className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${btnClass}`}
      >
        {btnLabel}
      </button>
    </section>
  );
}
