import { useState } from "react";
import { PiClipboardText, PiSun, PiPlayCircle, PiCheckCircle, PiBank } from "react-icons/pi";
import RewardBadge from "../components/RewardBadge";
import ProofModal from "../components/ProofModal";
import QuestCard from "../components/QuestCard";
import {
  useQuestData,
  type OfficialCampaign,
  type OfficialStep,
  type CompletionMap,
} from "../hooks/useQuestData";

export default function QuestsScreen() {
  const {
    data, loading,
    handleCheckin, handleWatchAd, handleVerifyStep, submitProof,
  } = useQuestData();
  const [proofStep, setProofStep] = useState<OfficialStep | null>(null);

  function handleStartPassive(stepId: string) {
    const step = data.official?.quests.find((s) => s.id === stepId);
    if (step) setProofStep(step);
  }

  async function handleProofSubmit(proof: string) {
    if (!proofStep) return;
    await submitProof(proofStep.id, proof);
    setProofStep(null);
  }

  const adRemaining = data.dailyStatus.maxAdWatches - data.dailyStatus.adWatches;

  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <QuestBoardHeader />

      <DailySection
        checkedIn={data.dailyStatus.checkedIn}
        adRemaining={adRemaining}
        loading={loading}
        onCheckin={handleCheckin}
        onWatchAd={handleWatchAd}
      />

      {data.official && (
        <OfficialSection
          campaign={data.official}
          completions={data.completions}
          loading={loading}
          onVerify={handleVerifyStep}
          onStart={handleStartPassive}
        />
      )}

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

function QuestBoardHeader() {
  return (
    <header className="text-center mb-1">
      <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
        <PiClipboardText /> Quest Board
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        Complete tasks to earn rewards
      </p>
    </header>
  );
}

function DailySection({
  checkedIn, adRemaining, loading, onCheckin, onWatchAd,
}: {
  checkedIn: boolean;
  adRemaining: number;
  loading: string | null;
  onCheckin: () => void;
  onWatchAd: () => void;
}) {
  return (
    <section>
      <h2 className="section-header flex items-center gap-2">
        <PiSun className="text-amber-500" /> Daily Tasks
      </h2>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <DailyCard
          icon={<PiPlayCircle />}
          title="Watch Ad"
          subtitle={adRemaining > 0 ? `${adRemaining}/3 left` : "Limit reached"}
          reward={<RewardBadge type="spin" value={1} />}
          done={adRemaining <= 0}
          loading={loading === "ad"}
          onClick={onWatchAd}
        />
        <DailyCard
          icon={<PiCheckCircle />}
          title="Check-in"
          subtitle={checkedIn ? "Done for today" : "Tap to check in"}
          reward={<RewardBadge type="coin" value={50} />}
          done={checkedIn}
          loading={loading === "checkin"}
          onClick={onCheckin}
        />
      </div>
    </section>
  );
}

function DailyCard({
  icon, title, subtitle, reward, done, loading: isLoading, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  reward: React.ReactNode;
  done: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={done || isLoading}
      className={`daily-card ${done ? "daily-card-done" : ""}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-bold text-slate-700">{title}</span>
      {reward}
      <span className="text-[10px] text-slate-400 mt-auto">
        {isLoading ? "..." : subtitle}
      </span>
    </button>
  );
}

function OfficialSection({
  campaign, completions, loading, onVerify, onStart,
}: {
  campaign: OfficialCampaign;
  completions: CompletionMap;
  loading: string | null;
  onVerify: (id: string) => void;
  onStart: (id: string) => void;
}) {
  const steps = [...campaign.quests].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const visibleSteps = steps.filter(
    (s) => completions[s.id]?.status !== "completed"
  );

  if (visibleSteps.length === 0) return null;

  return (
    <section>
      <h2 className="section-header flex items-center gap-2">
        <PiBank className="text-slate-400" /> Official
      </h2>
      <div className="flex flex-col gap-2 mt-3">
        {visibleSteps.map((step) => (
          <QuestCard
            key={step.id}
            title={step.title}
            description={step.description}
            taskType={step.task_type}
            rewardType={campaign.reward_type}
            rewardValue={campaign.reward_value}
            status={completions[step.id]?.status}
            loading={loading === step.id}
            onVerify={() => onVerify(step.id)}
            onStart={() => onStart(step.id)}
          />
        ))}
      </div>
    </section>
  );
}
