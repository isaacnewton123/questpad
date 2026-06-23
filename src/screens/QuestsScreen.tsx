import { PiClipboardText } from "react-icons/pi";
import ProofModal from "../components/quest/ProofModal";
import OfficialSection from "../components/quest/OfficialSection";
import DailyQuestsSection from "../components/quest/DailyQuestsSection";
import { useQuestData } from "../hooks/useQuestData";
import { useProofModal } from "../hooks/useProofModal";

export default function QuestsScreen() {
  const { data, loading, handleVerifyStep, submitProof } = useQuestData();
  const proof = useProofModal(submitProof, data.official?.quests);

  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <QuestBoardHeader />
      <DailyQuestsSection />

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
