import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { useUser } from "../context/useUser";

interface Step {
  id: string;
  title: string;
  description: string;
  task_type: string;
  target_url: string;
  sort_order: number;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  campaign_type: string;
  reward_type: string;
  reward_value: number;
  reward_pool: number;
  max_completions: number | null;
  current_completions: number;
  participant_count: number;
  expires_at: string;
  is_drawn: boolean;
  logo_url?: string;
}

type Completions = Record<string, { status: string }>;

interface DetailResponse {
  campaign: Campaign;
  steps: Step[];
  completions: Completions;
  claimed: boolean;
}

export function useCampaignDetail(id: string | undefined) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      const res = await apiFetch<DetailResponse>(`/campaigns/${id}`);
      if (res.ok && !cancelled) {
        setCampaign(res.data.campaign);
        setSteps(res.data.steps);
        setCompletions(res.data.completions);
        setClaimed(res.data.claimed);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const actions = useCampaignActions(
    id, setCompletions, claiming, setClaiming, setClaimed
  );

  const allDone = steps.length > 0 && steps.every(
    (s) => completions[s.id]?.status === "completed"
  );

  return {
    campaign, steps, completions, claimed, claiming,
    loading, allDone, ...actions,
  };
}

function useCampaignActions(
  id: string | undefined,
  setCompletions: React.Dispatch<React.SetStateAction<Completions>>,
  claiming: boolean,
  setClaiming: React.Dispatch<React.SetStateAction<boolean>>,
  setClaimed: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { refetchUser } = useUser();

  const handleVerify = useCallback(async (stepId: string) => {
    const res = await apiFetch<{ status: string, fallback?: boolean, error?: string }>(
      `/quests/${stepId}/verify`, "POST"
    );
    if (res.ok) {
      setCompletions((prev) => ({
        ...prev, [stepId]: { status: "completed" },
      }));
      return { ok: true };
    }
    return { ok: false, fallback: res.data?.fallback, error: res.data?.error };
  }, [setCompletions]);

  const submitProof = useCallback(async (stepId: string, proof: string) => {
    const res = await apiFetch<{ status: string }>(
      `/quests/${stepId}/start`, "POST", { proof }
    );
    if (res.ok) {
      setCompletions((prev) => ({
        ...prev, [stepId]: { status: "in_progress" },
      }));
    }
  }, [setCompletions]);

  const handleClaim = useCallback(async () => {
    if (!id || claiming) return;
    setClaiming(true);
    const res = await apiFetch(`/campaigns/${id}/claim`, "POST");
    if (res.ok) {
      setClaimed(true);
      refetchUser();
    }
    setClaiming(false);
  }, [id, claiming, refetchUser, setClaiming, setClaimed]);

  return { handleVerify, submitProof, handleClaim };
}

export type { Step, Campaign, Completions };
