import { PiSun, PiPlayCircle, PiCheckCircle } from "react-icons/pi";
import RewardBadge from "../ui/RewardBadge";

export default function DailySection({
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
