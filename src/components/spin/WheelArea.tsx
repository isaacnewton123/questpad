import SpinWheel from "./SpinWheel";
import ResultModal from "./ResultModal";

interface SpinResponse {
  prize_name: string;
  prize_type: "ton" | "coin";
  prize_value: number;
  streak: number;
  spin_type: string;
  error?: string;
}

export interface SpinState {
  segments: { label: string; type: string; value: number }[];
  prizes: { id: string; prize_name: string; prize_type: string; prize_value: number }[];
  spinning: boolean;
  targetIndex: number | null;
  result: SpinResponse | null;
  showResult: boolean;
}

export default function WheelArea({ state, setState, refetchUser }: {
  state: SpinState;
  setState: React.Dispatch<React.SetStateAction<SpinState>>;
  refetchUser: () => Promise<void>;
}) {
  function handleSpinEnd() {
    setState((s) => ({ ...s, spinning: false, showResult: true }));
  }

  function handleCloseResult() {
    setState((s) => ({
      ...s, showResult: false, result: null, targetIndex: null,
    }));
    refetchUser();
  }

  return (
    <>
      {state.segments.length > 0 && (
        <SpinWheel
          segments={state.segments}
          spinning={state.spinning}
          targetIndex={state.targetIndex}
          onSpinEnd={handleSpinEnd}
        />
      )}
      {state.result && (
        <ResultModal
          prizeName={state.result.prize_name}
          prizeType={state.result.prize_type}
          prizeValue={state.result.prize_value}
          colorIndex={state.targetIndex ?? 0}
          visible={state.showResult}
          onClose={handleCloseResult}
        />
      )}
    </>
  );
}
