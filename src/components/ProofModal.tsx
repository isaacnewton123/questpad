import { useState, useRef } from "react";

interface ProofModalProps {
  taskType: string;
  onSubmit: (proof: string) => void;
  onClose: () => void;
}

const PLACEHOLDERS: Record<string, string> = {
  twitter_follow: "Enter your X username (e.g. @JohnDoe)",
  twitter_retweet: "Enter your X username (e.g. @JohnDoe)",
  ig_follow: "Enter your Instagram username",
};

export default function ProofModal({
  taskType, onSubmit, onClose,
}: ProofModalProps) {
  const [value, setValue] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  const placeholder =
    PLACEHOLDERS[taskType] ?? "Enter your username";

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="proof-modal-backdrop"
    >
      <div className="proof-modal">
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Submit Proof
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Enter your username so we can verify your task.
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="proof-input"
          autoFocus
        />
        <ProofModalActions
          onClose={onClose}
          onSubmit={handleSubmit}
          disabled={!value.trim()}
        />
      </div>
    </div>
  );
}

function ProofModalActions({
  onClose, onSubmit, disabled,
}: {
  onClose: () => void; onSubmit: () => void; disabled: boolean;
}) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold
          text-slate-500 bg-slate-100 active:scale-95 transition-transform"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="flex-1 py-2.5 rounded-xl text-sm font-bold
          text-white bg-slate-900 disabled:opacity-40
          active:scale-95 transition-transform"
      >
        Submit
      </button>
    </div>
  );
}
