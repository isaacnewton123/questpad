import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { useUser } from "../context/useUser";

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  task_type: string;
  reward_type: string;
  reward_value: number;
}

interface OfficialStep {
  id: string;
  title: string;
  description: string;
  task_type: string;
  target_url: string;
  sort_order: number;
  reward_type: string;
  reward_value: number;
  verification_type?: string;
  proof_placeholder?: string;
}

interface OfficialCampaign {
  id: string;
  title: string;
  reward_type: string;
  reward_value: number;
  quests: OfficialStep[];
}

interface DailyStatus {
  checkedIn: boolean;
  adWatches: number;
  maxAdWatches: number;
}

type CompletionMap = Record<string, { status: string }>;

interface QuestState {
  daily: DailyQuest[];
  official: OfficialCampaign | null;
  completions: CompletionMap;
  dailyStatus: DailyStatus;
}

const INITIAL: QuestState = {
  daily: [],
  official: null,
  completions: {},
  dailyStatus: { checkedIn: false, adWatches: 0, maxAdWatches: 3 },
};

export function useQuestData() {
  const { refetchUser } = useUser();
  const [data, setData] = useState<QuestState>(INITIAL);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<QuestState>("/quests/available");
      if (res.ok && !cancelled) setData(res.data);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handlers = useDailyHandlers(setData, setLoading, refetchUser);
  const stepHandlers = useStepHandlers(setData, setLoading, refetchUser);

  return { data, loading, refetchUser, ...handlers, ...stepHandlers };
}

function useDailyHandlers(
  setData: React.Dispatch<React.SetStateAction<QuestState>>,
  setLoading: React.Dispatch<React.SetStateAction<string | null>>,
  refetchUser: () => void
) {
  const handleCheckin = useCallback(async () => {
    setLoading("checkin");
    const res = await apiFetch("/daily/checkin", "POST");
    let success = false;
    if (res.ok) {
      setData((s) => ({
        ...s, dailyStatus: { ...s.dailyStatus, checkedIn: true },
      }));
      refetchUser();
      success = true;
    }
    setLoading(null);
    return success;
  }, [setData, setLoading, refetchUser]);

  return { handleCheckin };
}

function useStepHandlers(
  setData: React.Dispatch<React.SetStateAction<QuestState>>,
  setLoading: React.Dispatch<React.SetStateAction<string | null>>,
  refetchUser: () => void
) {
  const handleVerifyStep = useCallback(async (stepId: string) => {
    setLoading(stepId);
    const res = await apiFetch<{ status?: string, error?: string }>(
      `/quests/${stepId}/verify`, "POST"
    );
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        completions: {
          ...prev.completions,
          [stepId]: { status: "completed" },
        },
      }));
      refetchUser();
    } else {
      alert(res.data.error || "Verification failed. Make sure you completed the task!");
    }
    setLoading(null);
  }, [setData, setLoading, refetchUser]);

  const submitProof = useCallback(async (
    stepId: string, proof: string
  ) => {
    const res = await apiFetch(
      `/quests/${stepId}/start`, "POST", { proof }
    );
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        completions: {
          ...prev.completions,
          [stepId]: { status: "in_progress" },
        },
      }));
    }
  }, [setData]);

  return { handleVerifyStep, submitProof };
}

export type {
  DailyQuest, OfficialStep, OfficialCampaign,
  DailyStatus, CompletionMap, QuestState,
};
