import { useNavigate } from "react-router-dom";
import { PiCaretLeftBold } from "react-icons/pi";

export default function SpinHeader() {
  const navigate = useNavigate();
  return (
    <header className="w-full max-w-md flex flex-col items-center justify-center relative">
      <button
        onClick={() => navigate("/")}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 py-2 pr-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
      >
        <PiCaretLeftBold size={18} />
        <span className="text-sm font-semibold tracking-wide">Back</span>
      </button>
      <img src="/logo-with-name.webp" alt="QuestPad" className="h-16 object-contain drop-shadow-md" />
      <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
        Spin to Earn
      </p>
    </header>
  );
}
