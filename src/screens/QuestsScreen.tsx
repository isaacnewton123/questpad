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
import { useAds } from "../hooks/useAds";

export default function QuestsScreen() {
  const {
    data, loading,
    handleCheckin, handleVerifyStep, submitProof, refetchUser
  } = useQuestData();
  const proof = useProofModal(submitProof, data.official?.quests);
  const checkin = useCheckinModal(handleCheckin);
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const { showRewardedAd, isPlaying } = useAds(userId);

  const handleAdClick = useAdClickHandler(showRewardedAd, refetchUser);

  const adRemaining = data.dailyStatus.maxAdWatches - data.dailyStatus.adWatches;

  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <QuestBoardHeader />

      <DailySection
        checkedIn={data.dailyStatus.checkedIn}
        adRemaining={adRemaining}
        loading={loading || (isPlaying ? "ad" : null)}
        onCheckin={checkin.onClick}
        onWatchAd={handleAdClick}
      />

      {data.official && (
        <OfficialSection
          campaign={data.official}
          completions={data.completions}
          loading={loading}
          onVerify={handleVerifyStep}
          onStart={proof.start}
        />
      )}

      {proof.step && (
        <ProofModal
          taskType={proof.step.task_type}
          onSubmit={proof.submit}
          onClose={() => proof.setStep(null)}
        />
      )}
      {checkin.showModal && (
        <CheckInSuccessModal onClose={() => checkin.setShowModal(false)} />
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

function useProofModal(submitProof: (id: string, proof: string) => Promise<void>, quests: OfficialStep[] = []) {
  const [step, setStep] = useState<OfficialStep | null>(null);
  
  function start(stepId: string) {
    const found = quests.find((s) => s.id === stepId);
    if (found) setStep(found);
  }

  async function submit(proof: string) {
    if (!step) return;
    await submitProof(step.id, proof);
    setStep(null);
  }

  return { step, setStep, start, submit };
}

function useAdClickHandler(
  showRewardedAd: () => Promise<{ success: boolean; provider?: import("../hooks/useAds").AdProvider }>,
  refetchUser: () => void
) {
  return async () => {
    const { success } = await showRewardedAd();
    if (success) {
      // S2S webhooks can take a few seconds. We poll 3 times 
      // to ensure the UI updates
      setTimeout(refetchUser, 2000);
      setTimeout(refetchUser, 5000);
      setTimeout(refetchUser, 9000);
    }
  };
}

function useCheckinModal(handleCheckin: () => Promise<boolean>) {
  const [showModal, setShowModal] = useState(false);

  async function onClick() {
    const success = await handleCheckin();
    if (success) setShowModal(true);
  }

  return { showModal, setShowModal, onClick };
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
        {visibleSteps.map((step) => {
          console.log("STEP DEBUG:", step.title, step.reward_type, step.reward_value);
          return (
          <QuestCard
            key={step.id}
            title={step.title}
            description={step.description}
            taskType={step.task_type}
            targetUrl={step.target_url}
            rewardType={step.reward_type || campaign.reward_type}
            rewardValue={step.reward_value || campaign.reward_value}
            status={completions[step.id]?.status}
            loading={loading === step.id}
            onVerify={() => onVerify(step.id)}
            onStart={() => onStart(step.id)}
          />
          );
        })}
      </div>
    </section>
  );
}

function CheckInSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 border-4 border-amber-50">
            <PiCheckCircle className="text-amber-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Check-in Complete!</h2>
          <p className="text-sm text-slate-500 mb-6">
            You've successfully checked in for today and earned <strong className="text-amber-500">50 Coins</strong>. Come back tomorrow for more!
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-sm shadow-amber-200"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
