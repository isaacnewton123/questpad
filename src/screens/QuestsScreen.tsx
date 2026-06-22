import { PiClipboardText } from "react-icons/pi";
import ProofModal from "../components/quest/ProofModal";
import DailySection from "../components/quest/DailySection";
import OfficialSection from "../components/quest/OfficialSection";
import CheckInSuccessModal from "../components/quest/CheckInSuccessModal";
import { useQuestData } from "../hooks/useQuestData";
import { useAds } from "../hooks/useAds";
import { useProofModal } from "../hooks/useProofModal";
import { useAdVerification } from "../hooks/useAdVerification";
import { useCheckinModal } from "../hooks/useCheckinModal";

export default function QuestsScreen() {
  const {
    data, loading,
    handleCheckin, handleVerifyStep, submitProof, refetchUser
  } = useQuestData();
  const proof = useProofModal(submitProof, data.official?.quests);
  const checkin = useCheckinModal(handleCheckin);
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const { showRewardedAd, isPlaying } = useAds(userId);

  const adCheck = useAdVerification(
    data.dailyStatus.adWatches,
    data.dailyStatus.maxAdWatches,
    showRewardedAd,
    refetchUser
  );

  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <QuestBoardHeader />

      <DailySection
        checkedIn={data.dailyStatus.checkedIn}
        adRemaining={adCheck.adRemaining}
        loading={loading || (isPlaying || adCheck.verifyingAd ? "ad" : null)}
        onCheckin={checkin.onClick}
        onWatchAd={adCheck.handleAdClick}
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
          customPlaceholder={proof.step.proof_placeholder}
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
