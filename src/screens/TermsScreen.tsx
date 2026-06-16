import { TERMS_SECTIONS } from "../constants/terms";

function TermsSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-[#94A3B8] leading-relaxed">{content}</p>
    </section>
  );
}

export default function TermsScreen() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 overflow-y-auto pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#E2E8F0] tracking-tight">Terms of Use</h1>
          <p className="text-[#94A3B8] text-sm mt-2 font-medium uppercase tracking-wider">Last Updated: June 2026</p>
        </div>

        <div className="space-y-8 bg-[#1E293B]/50 p-6 sm:p-8 rounded-2xl border border-slate-800">
          {TERMS_SECTIONS.map((section, index) => (
            <TermsSection key={index} title={section.title} content={section.content} />
          ))}
        </div>

        <div className="pt-6 border-t border-slate-700/50 text-sm text-[#64748B] text-center">
          <p>Continued use of QuestPad constitutes immediate and binding acceptance of any changes made to these Terms of Use.</p>
        </div>
      </div>
    </div>
  );
}
