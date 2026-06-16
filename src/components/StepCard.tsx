import { useState, useEffect, useCallback } from "react";
import { PiTelegramLogo, PiXLogo, PiGlobe, PiCheck, PiArrowRight } from "react-icons/pi";

interface StepCardProps {
  index: number;
  step: {
    id: string;
    title: string;
    description: string;
    task_type: string;
    target_url: string;
  };
  status?: string;
  onVerify: (stepId: string) => void;
  onStart: (stepId: string) => void;
}

const ICONS: Record<string, typeof PiGlobe> = {
  tg_join: PiTelegramLogo,
  twitter_follow: PiXLogo,
  twitter_retweet: PiXLogo,
};

const PASSIVE_TYPES = new Set([
  "twitter_follow", "twitter_retweet", "ig_follow",
]);

export default function StepCard({
  index, step, status, onVerify, onStart,
}: StepCardProps) {
  const Icon = ICONS[step.task_type] ?? PiGlobe;
  const isPassive = PASSIVE_TYPES.has(step.task_type);
  const [cooldown, setCooldown] = useState(0);
  const [opened, setOpened] = useState(false);

  const tickDown = useCallback(() => {
    setCooldown((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(tickDown, 1000);
    return () => clearInterval(t);
  }, [cooldown, tickDown]);

  function handleStartClick() {
    window.open(step.target_url, "_blank");
    setOpened(true);
    if (isPassive) setCooldown(15);
  }

  function handleVerifyClick() {
    if (isPassive) {
      onStart(step.id);
    } else {
      onVerify(step.id);
    }
  }

  return (
    <div className={`step-card ${status === "completed" ? "step-done" : ""}`}>
      <div className="flex items-start gap-3">
        <StepNumber num={index + 1} done={status === "completed"} />
        <StepCardText step={step} Icon={Icon} />
        <ActionButton
          status={status}
          taskType={step.task_type}
          cooldown={cooldown}
          opened={opened}
          onStart={handleStartClick}
          onVerify={handleVerifyClick}
        />
      </div>
    </div>
  );
}

function StepCardText({ step, Icon }: { step: StepCardProps["step"]; Icon: React.ElementType }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-slate-400 shrink-0" />
        <h4 className="text-sm font-semibold text-slate-700 truncate">
          {step.title}
        </h4>
      </div>
      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
        {step.description}
      </p>
    </div>
  );
}

function StepNumber({ num, done }: { num: number; done: boolean }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center
      text-xs font-bold shrink-0 ${
        done
          ? "bg-emerald-100 text-emerald-600"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {done ? <PiCheck /> : num}
    </div>
  );
}

function ActionButton({
  status, taskType, cooldown, opened, onStart, onVerify,
}: {
  status?: string;
  taskType: string;
  cooldown: number;
  opened: boolean;
  onStart: () => void;
  onVerify: () => void;
}) {
  if (status === "completed") {
    return (
      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
        <PiCheck /> Done
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="text-xs font-semibold text-amber-500 animate-pulse">
        Verifying...
      </span>
    );
  }
  if (cooldown > 0) {
    return (
      <button disabled className="step-btn-disabled">
        {cooldown}s
      </button>
    );
  }
  if (!opened) {
    return (
      <button onClick={onStart} className="step-btn-secondary flex items-center justify-center gap-1">
        {taskType === "tg_join" ? "Join" : "Start"} <PiArrowRight />
      </button>
    );
  }

  return (
    <button onClick={onVerify} className="step-btn-primary">
      Verify
    </button>
  );
}
