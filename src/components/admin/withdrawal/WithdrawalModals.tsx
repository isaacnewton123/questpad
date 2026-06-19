import { useState } from "react";
import { PiPaperPlaneTilt, PiXCircle, PiX } from "react-icons/pi";
import type { AdminWithdrawal } from "../../../types/admin.types";

function PaymentSummary({ w }: { w: AdminWithdrawal }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
      <p>
        <span className="text-slate-500">To:</span>{" "}
        <span className="font-mono font-bold text-slate-700 break-all">
          @{w.username}
        </span>
      </p>
      <p>
        <span className="text-slate-500">Wallet:</span>{" "}
        <span className="font-mono text-slate-600 break-all">
          {w.wallet_address}
        </span>
      </p>
      <p>
        <span className="text-slate-500">Amount:</span>{" "}
        <span className="font-bold text-blue-600">
          {w.amount_net.toFixed(3)} TON
        </span>
      </p>
    </div>
  );
}

function ModalInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 block mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
          font-mono focus:outline-none focus:ring-2 focus:ring-blue-300
          placeholder:text-slate-300"
      />
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-end justify-center p-4 pb-10">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <PiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TxHashModal({
  withdrawal,
  onSubmit,
  onClose,
}: {
  withdrawal: AdminWithdrawal;
  onSubmit: (id: string, txHash: string) => void;
  onClose: () => void;
}) {
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!txHash.trim()) return;
    setSubmitting(true);
    await onSubmit(withdrawal.id, txHash.trim());
    setSubmitting(false);
  }

  return (
    <ModalShell title="Confirm Payment" onClose={onClose}>
      <PaymentSummary w={withdrawal} />
      <ModalInput
        value={txHash}
        onChange={setTxHash}
        label="Transaction Hash / Signature"
        placeholder="Paste tx hash here..."
      />
      <button
        onClick={handleSubmit}
        disabled={!txHash.trim() || submitting}
        className="w-full py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl
          hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-colors"
      >
        <PiPaperPlaneTilt />
        {submitting ? "Submitting..." : "Mark as Paid"}
      </button>
    </ModalShell>
  );
}

export function RejectModal({
  withdrawal,
  onSubmit,
  onClose,
}: {
  withdrawal: AdminWithdrawal;
  onSubmit: (id: string, reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSubmitting(true);
    await onSubmit(withdrawal.id, reason.trim());
    setSubmitting(false);
  }

  return (
    <ModalShell title="Reject Withdrawal" onClose={onClose}>
      <PaymentSummary w={withdrawal} />
      <ModalInput
        value={reason}
        onChange={setReason}
        label="Rejection Reason"
        placeholder="Enter reason for rejection..."
      />
      <button
        onClick={handleSubmit}
        disabled={!reason.trim() || submitting}
        className="w-full py-3 bg-red-500 text-white font-bold text-sm rounded-xl
          hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-colors"
      >
        <PiXCircle />
        {submitting ? "Rejecting..." : "Reject & Refund"}
      </button>
    </ModalShell>
  );
}
