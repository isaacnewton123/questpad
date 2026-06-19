import { useState } from "react";
import { PiUsers, PiCopy, PiCheck } from "react-icons/pi";

export default function InviteLinkSection({ telegramId }: { telegramId: number | null }) {
  const [copied, setCopied] = useState(false);
  const botUsername = "QuestPadBot";
  const refLink = `https://t.me/${botUsername}?start=ref_${telegramId ?? ""}`;

  function handleCopy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-panel p-5 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
      <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
        <PiUsers size={16} />
        Your Invite Link
      </h2>
      <div className="flex gap-2">
        <input
          readOnly
          value={refLink}
          className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate"
        />
        <button
          onClick={handleCopy}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
        >
          {copied ? <PiCheck size={14} /> : <PiCopy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[10px] text-blue-600/70 mt-2">
        Friends must connect a wallet, complete Official Quests, and watch 3 ads to qualify.
      </p>
    </div>
  );
}
