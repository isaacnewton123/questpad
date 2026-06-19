import { useState } from "react";
import { PiTelegramLogo, PiXLogo, PiGlobe, PiCheck } from "react-icons/pi";
import RewardBadge from "../ui/RewardBadge";

interface QuestCardProps {
  title: string;
  description: string;
  taskType: string;
  targetUrl: string;
  rewardType: string;
  rewardValue: number;
  status?: string;
  loading?: boolean;
  onVerify: () => void;
  onStart: () => void;
}

const TASK_ICONS: Record<string, typeof PiGlobe> = {
  tg_join: PiTelegramLogo,
  twitter_follow: PiXLogo,
  twitter_retweet: PiXLogo,
  api_check: PiGlobe,
};

const PASSIVE_TYPES = new Set([
  "twitter_follow", "twitter_retweet", "ig_follow",
]);

export default function QuestCard({
  title, description, taskType, targetUrl, rewardType,
  rewardValue, status, loading: isLoading, onVerify, onStart,
}: QuestCardProps) {
  const Icon = TASK_ICONS[taskType] ?? PiGlobe;
  const [opened, setOpened] = useState(false);

  function handleActionClick() {
    if (targetUrl) window.open(targetUrl, "_blank");
    setOpened(true);
  }

  return (
    <div className="glass-panel p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center
        justify-center shrink-0 border border-blue-100">
        <Icon size={20} className="text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 truncate">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
          {description}
        </p>
        <div className="mt-2">
          <RewardBadge type={rewardType} value={rewardValue} />
        </div>
      </div>
      <div className="shrink-0">
        <QuestActionButton
          taskType={taskType}
          status={status}
          loading={isLoading}
          opened={opened}
          onActionClick={handleActionClick}
          onVerify={onVerify}
          onStart={onStart}
        />
      </div>
    </div>
  );
}

function QuestActionButton({
  taskType, status, loading, opened, onActionClick, onVerify, onStart,
}: {
  taskType: string; status?: string; loading?: boolean; opened: boolean;
  onActionClick: () => void; onVerify: () => void; onStart: () => void;
}) {
  const isPassive = PASSIVE_TYPES.has(taskType);
  if (status === "completed") {
    return <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><PiCheck /> Done</span>;
  }
  if (status === "in_progress") {
    return <span className="text-xs font-semibold text-amber-500 animate-pulse">Verifying...</span>;
  }
  if (loading) {
    return <span className="text-xs text-slate-400">...</span>;
  }
  
  if (!opened) {
    return (
      <button
        onClick={onActionClick}
        className="text-xs font-bold px-3 py-1.5 rounded-full
          bg-slate-900 text-white active:scale-95 transition-all"
      >
        {taskType === "tg_join" ? "Join" : "Start"}
      </button>
    );
  }

  return (
    <button
      onClick={isPassive ? onStart : onVerify}
      className="text-xs font-bold px-3 py-1.5 rounded-full
        bg-slate-900 text-white active:scale-95 transition-all"
    >
      Verify
    </button>
  );
}

