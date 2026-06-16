import { PRIVACY_SECTIONS } from "../constants/privacy";
import { Link } from "react-router-dom";
import { PiCaretLeftBold } from "react-icons/pi";

function PolicySection({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
    </section>
  );
}

export default function PrivacyScreen() {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      
      <div className="flex items-center">
        <Link to="/profile" className="flex items-center gap-1 text-blue-500 font-semibold bg-white/60 px-3 py-1.5 rounded-xl shadow-sm">
          <PiCaretLeftBold /> Back
        </Link>
      </div>

      <div className="space-y-6 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold uppercase tracking-wider">Last Updated: June 2026</p>
        </div>

        <div className="space-y-6">
          {PRIVACY_SECTIONS.map((section, index) => (
            <PolicySection key={index} title={section.title} content={section.content} />
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 text-center font-medium">
          <p>If you have any questions or require clarification about this Privacy Policy, please contact the official administration team via the QuestPad Telegram Bot.</p>
        </div>
      </div>
    </div>
  );
}
