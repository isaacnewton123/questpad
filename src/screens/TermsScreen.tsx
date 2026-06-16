const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing, interacting with, or playing QuestPad via the Telegram application, you expressly accept and agree to be bound by the terms and provisions of this binding legal agreement. If you do not agree to abide by all of these terms unconditionally, you must immediately cease use of this application."
  },
  {
    title: "2. Description of Service",
    content: "QuestPad is a decentralized 'Spin-to-Earn' mini-application built on Telegram. The platform allows users to participate in a virtual prize wheel, complete social/partner quests, and view digital advertisements in exchange for virtual coins and fractions of TON (The Open Network) cryptocurrency."
  },
  {
    title: "3. User Conduct and Anti-Fraud Policy",
    content: "We maintain a zero-tolerance policy for fraud. Users are strictly prohibited from utilizing automated bots, emulators, multiple accounts, sybil attacks, or exploiting system bugs to artificially inflate rewards. All ad views and quest completions are verified via server-to-server cryptographic tokens. Any attempt to spoof rewards or manipulate the database will result in immediate, permanent account termination and the forfeiture of all accumulated balances without appeal."
  },
  {
    title: "4. Virtual Currency and Rewards",
    content: "In-game 'Coins' and 'Spins' are virtual utility tokens designed solely for use within the QuestPad ecosystem. They do not constitute legal tender, investments, or securities. The exchange rate, probability mechanics, and value of these virtual items are determined entirely at the discretion of the QuestPad administration and may change at any time."
  },
  {
    title: "5. Withdrawals and Crypto Assets",
    content: "Withdrawals of TON cryptocurrency to external wallets are subject to strict minimum balance requirements, referral quotas, and blockchain network gas fees. QuestPad is not a registered financial institution. Accumulated in-game balances do not hold real-world fiat value until successfully withdrawn to the decentralized TON blockchain. We assume absolutely no liability for funds sent to incorrect, incompatible, or invalid wallet addresses provided by the user."
  },
  {
    title: "6. Intellectual Property",
    content: "All content, branding, visual interfaces, graphics, design, and underlying code associated with QuestPad are the exclusive property of QuestPad. You are granted a limited, non-exclusive, non-transferable license to access the application for personal, non-commercial use."
  },
  {
    title: "7. Limitation of Liability",
    content: "To the maximum extent permitted by applicable law, QuestPad and its developers, affiliates, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the service. This includes, but is not limited to, losses stemming from network outages, third-party API failures, blockchain congestion, or unauthorized access to your account."
  },
  {
    title: "8. Dispute Resolution",
    content: "Any disputes arising from or relating to these Terms of Use or the QuestPad application shall be resolved through binding, confidential arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify."
  },
  {
    title: "9. Modifications to Service",
    content: "We reserve the unilateral right to modify, suspend, or permanently discontinue any aspect of QuestPad at any time without prior notice or liability. This specifically includes adjusting prize pool probabilities, modifying withdrawal limits, altering referral payouts, and adding or removing campaign quests."
  }
];

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
