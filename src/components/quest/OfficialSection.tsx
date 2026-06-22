import { PiBank } from "react-icons/pi";
import QuestCard from "./QuestCard";
import type { OfficialCampaign, CompletionMap } from "../../hooks/useQuestData";

export default function OfficialSection({
  campaign,
  completions,
  loading,
  onVerify,
  onStart,
}: {
  campaign: OfficialCampaign;
  completions: CompletionMap;
  loading: string | null;
  onVerify: (id: string) => void;
  onStart: (id: string) => void;
}) {
  const steps = [...campaign.quests].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const visibleSteps = steps.filter(
    (s) => completions[s.id]?.status !== "completed",
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
            targetUrl={step.target_url}
            rewardType={step.reward_type || campaign.reward_type}
            rewardValue={step.reward_value || campaign.reward_value}
            status={completions[step.id]?.status}
            loading={loading === step.id}
            verificationType={step.verification_type}
            onVerify={() => onVerify(step.id)}
            onStart={() => onStart(step.id)}
          />
        ))}
      </div>
    </section>
  );
}
