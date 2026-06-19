import StepCard from "./StepCard";
import type { Step } from "../../hooks/useCampaignDetail";

export default function CampaignStepList({
  steps,
  completions,
  onVerify,
  onStart,
}: {
  steps: Step[];
  completions: Record<string, { status: string }>;
  onVerify: (id: string) => Promise<void>;
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
