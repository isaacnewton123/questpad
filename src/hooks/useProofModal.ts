import { useState } from "react";
import type { OfficialStep } from "./useQuestData";

export function useProofModal(
  submitProof: (id: string, proof: string) => Promise<void>,
  quests: OfficialStep[] = []
) {
  const [step, setStep] = useState<OfficialStep | null>(null);

  function start(stepId: string) {
    const found = quests.find((s) => s.id === stepId);
    if (found) setStep(found);
  }

  async function submit(proof: string) {
    if (!step) return;
    await submitProof(step.id, proof);
    setStep(null);
  }

  return { step, setStep, start, submit };
}
