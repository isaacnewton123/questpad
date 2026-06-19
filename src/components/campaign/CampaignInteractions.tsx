import CampaignStepList from "./CampaignStepList";
import ClaimSection from "./ClaimSection";
import type {
  useCampaignDetail,
  Step,
  Campaign,
} from "../../hooks/useCampaignDetail";

export default function CampaignInteractions({
  state,
  campaign,
  setProofStep,
}: {
  state: ReturnType<typeof useCampaignDetail>;
  campaign: Campaign;
  setProofStep: (step: Step | null) => void;
}) {
  async function handleVerifyClick(stepId: string) {
    const res = await state.handleVerify(stepId);
    if (res && !res.ok) {
      if (res.fallback) {
        alert(res.error || "Falling back to manual proof");
        const step = state.steps.find((s: Step) => s.id === stepId);
        if (step) setProofStep(step);
      } else {
        alert(res.error || "Verification failed");
      }
    }
  }

  function handleStartPassive(stepId: string) {
    const step = state.steps.find((s: Step) => s.id === stepId);
    if (step) setProofStep(step);
  }

  return (
    <>
      <CampaignStepList
        steps={state.steps}
        completions={state.completions}
        onVerify={handleVerifyClick}
        onStart={handleStartPassive}
      />
      <ClaimSection
        campaign={campaign}
        canClaim={state.allDone && !state.claimed}
        claimed={state.claimed}
        claiming={state.claiming}
        onClaim={state.handleClaim}
      />
    </>
  );
}
