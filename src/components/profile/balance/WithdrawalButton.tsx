import { PiArrowSquareOut } from "react-icons/pi";

export default function WithdrawalButton({
  canWithdraw, withdrawing, ton, onWithdraw,
}: {
  canWithdraw: boolean;
  withdrawing: boolean;
  ton: number;
  onWithdraw: () => void;
}) {
  return (
    <>
      <button
        onClick={onWithdraw}
        disabled={!canWithdraw || withdrawing}
        className={`w-full text-sm font-bold py-3 rounded-2xl flex
          items-center justify-center gap-2 transition-all ${
            canWithdraw
              ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
      >
        <PiArrowSquareOut size={16} />
        {withdrawing ? "Processing..." : `Withdraw (min 0.1 TON)`}
      </button>
      {!canWithdraw && (
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Earn {(0.1 - ton).toFixed(3)} more TON to unlock withdrawal
        </p>
      )}
    </>
  );
}
