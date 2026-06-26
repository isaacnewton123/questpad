import { useCallback } from "react";
import { PiCalendarCheckFill, PiPlayCircleFill } from "react-icons/pi";
import { useQuestData } from "../../hooks/useQuestData";
import { useAds } from "../../hooks/useAds";
import { useAdVerification } from "../../hooks/useAdVerification";
import { useCheckinModal } from "../../hooks/useCheckinModal";
import CheckInSuccessModal from "./CheckInSuccessModal";
import RewardBadge from "../ui/RewardBadge";

export default function DailyQuestsSection() {
  const { data, loading, handleCheckin, refetchUser, refetchQuests } = useQuestData();
  const checkin = useCheckinModal(handleCheckin);
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const { showRewardedAd, isPlaying } = useAds(userId, "global");

  const handleRefetch = useCallback(() => {
    refetchUser();
    refetchQuests();
  }, [refetchUser, refetchQuests]);

  const adCheck = useAdVerification(
    data.dailyStatus.adWatches,
    data.dailyStatus.maxAdWatches,
    showRewardedAd,
    handleRefetch
  );

  const checkedIn = data.dailyStatus.checkedIn;
  const adRemaining = adCheck.adRemaining;
  const isLoading = loading || (isPlaying || adCheck.verifyingAd ? "ad" : null);

  return (
    <section className="w-full mt-2">
      <h2 className="section-header flex items-center gap-2 mb-3">
        <PiCalendarCheckFill className="text-blue-500" /> Daily Quests
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <DailyCard
          icon={<PiPlayCircleFill className="text-emerald-500" />}
          title="Watch Ad"
          subtitle={adRemaining > 0 ? `${adRemaining}/3 left` : "Limit reached"}
          reward={<RewardBadge type="coin" value={50} />}
          done={adRemaining <= 0}
          loading={isLoading === "ad"}
          onClick={adCheck.handleAdClick}
        />
        <DailyCard
          icon={<PiCalendarCheckFill className="text-blue-500" />}
          title="Daily Check-in"
          subtitle={checkedIn ? "Done for today" : "Check in every day"}
          reward={<RewardBadge type="coin" value={50} />}
          done={checkedIn}
          loading={isLoading === "checkin"}
          onClick={checkin.onClick}
        />
      </div>

      {checkin.showModal && <CheckInSuccessModal onClose={() => checkin.setShowModal(false)} />}
      {adCheck.showModal && <CheckInSuccessModal onClose={() => adCheck.setShowModal(false)} />}
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
