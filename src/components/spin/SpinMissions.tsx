import { PiSun, PiPlayCircle, PiCalendarCheckFill } from "react-icons/pi";
import RewardBadge from "../ui/RewardBadge";
import { useQuestData } from "../../hooks/useQuestData";
import { useAds } from "../../hooks/useAds";
import { useAdVerification } from "../../hooks/useAdVerification";
import { useCheckinModal } from "../../hooks/useCheckinModal";
import CheckInSuccessModal from "../quest/CheckInSuccessModal";

export default function SpinMissions() {
  const { data, loading, refetchUser, handleCheckin } = useQuestData();
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const { showRewardedAd, isPlaying } = useAds(userId, "spin");

  const adCheck = useAdVerification(
    data.dailyStatus.spinAdWatches,
    data.dailyStatus.maxAdWatches,
    showRewardedAd,
    refetchUser
  );

  const checkin = useCheckinModal(() => handleCheckin("spin"));
  const spinCheckedIn = data.dailyStatus.spinCheckedIn;

  const adRemaining = adCheck.adRemaining;
  const isLoading = loading || (isPlaying || adCheck.verifyingAd ? "ad" : null);

  return (
    <section className="w-full">
      <h2 className="section-header flex items-center gap-2">
        <PiSun className="text-amber-500" /> Spin Hub Missions
      </h2>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <DailyCard
          icon={<PiPlayCircle />}
          title="Watch Ad"
          subtitle={adRemaining > 0 ? `${adRemaining}/3 left` : "Limit reached"}
          reward={<RewardBadge type="spin" value={1} />}
          done={adRemaining <= 0}
          loading={isLoading === "ad"}
          onClick={adCheck.handleAdClick}
        />
        <DailyCard
          icon={<PiCalendarCheckFill className="text-emerald-500" />}
          title="Daily Check-in"
          subtitle={spinCheckedIn ? "Done for today" : "Check in for +1 Spin"}
          reward={<RewardBadge type="spin" value={1} />}
          done={spinCheckedIn}
          loading={loading === "checkin"}
          onClick={checkin.onClick}
        />
      </div>

      {checkin.showModal && (
        <CheckInSuccessModal 
          onClose={() => checkin.setShowModal(false)}
          rewardType="spin"
          rewardValue={1}
        />
      )}
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
