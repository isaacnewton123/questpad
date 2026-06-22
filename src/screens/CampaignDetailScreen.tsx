import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingView, NotFoundView } from "../components/ui/LoadingView";
import CampaignHeader from "../components/campaign/CampaignHeader";
import CampaignMetadataBar from "../components/campaign/CampaignMetadataBar";
import CampaignInteractions from "../components/campaign/CampaignInteractions";
import ProofModal from "../components/quest/ProofModal";
import { useCampaignDetail, type Step } from "../hooks/useCampaignDetail";

export default function CampaignDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useCampaignDetail(id);
  const [proofStep, setProofStep] = useState<Step | null>(null);

  if (state.loading) return <LoadingView />;
  if (!state.campaign) return <NotFoundView />;

  return (
    <div className="pb-nav max-w-md mx-auto">
      <div className="bg-animated" />
      <CampaignHeader campaign={state.campaign} onBack={() => navigate("/campaigns")} />
      <div className="px-4 space-y-4 mt-4">
        <CampaignMetadataBar campaign={state.campaign} />
        <CampaignInteractions state={state} campaign={state.campaign} setProofStep={setProofStep} />
      </div>
      {proofStep && (
        <ProofModal
          taskType={proofStep.task_type}
          customPlaceholder={proofStep.proof_placeholder}
          onSubmit={async (p) => { await state.submitProof(proofStep.id, p); setProofStep(null); }}
          onClose={() => setProofStep(null)}
        />
      )}
    </div>
  );
}
