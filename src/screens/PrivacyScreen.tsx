const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: "When you use QuestPad via Telegram, we collect basic information provided by the Telegram API (such as your Telegram ID, username, and language preference) and your connected TON Wallet address to facilitate rewards and gameplay. We do not collect personal identifying information such as real names, physical addresses, emails, or phone numbers unless explicitly provided by you for support purposes."
  },
  {
    title: "2. How We Use Your Data",
    content: "Your data is used exclusively for the core functions of QuestPad: maintaining your account ledger, verifying completed quests and ad views (via server-to-server validation with Adsgram/Monetag), preventing fraudulent activity, executing withdrawals to your TON wallet via the blockchain, and improving our overall user experience."
  },
  {
    title: "3. Third-Party Services and Advertising",
    content: "We integrate with third-party advertising networks (including Adsgram and Monetag) to serve rewarded advertisements. These providers may collect anonymous device data, advertising IDs, and IP addresses to serve relevant ads. Furthermore, we interact with the TON Blockchain and public node APIs to process and verify decentralized transactions."
  },
  {
    title: "4. Blockchain Transactions",
    content: "Please be aware that any transactions executed on the TON Blockchain (such as withdrawals and rewards distribution) are inherently public. Your wallet address and transaction history are permanently recorded on a decentralized, public ledger and cannot be altered or deleted by QuestPad."
  },
  {
    title: "5. Data Security",
    content: "We employ robust industry-standard security measures, including strictly enforced Row-Level Security (RLS) on our databases and atomic transactions, to protect your in-game balance and withdrawal history from unauthorized access, alteration, or data breaches."
  },
  {
    title: "6. Data Retention",
    content: "We retain your data for as long as your account remains active. Because we operate within the Telegram ecosystem, deleting your Telegram account or completely blocking the QuestPad bot may restrict your access to the platform, though immutable ledger data will remain securely stored."
  },
  {
    title: "7. Your Rights",
    content: "You maintain the right to request the deletion of your account and associated off-chain data at any time. To exercise these rights, please contact our support team. As noted, on-chain public data cannot be erased under the 'Right to be Forgotten'."
  },
  {
    title: "8. Children's Privacy",
    content: "QuestPad is not intended for individuals under the age of 18 or the age of legal majority in your jurisdiction. We do not knowingly collect personal information from children. If we become aware that we have collected such data, it will be deleted immediately."
  },
  {
    title: "9. Changes to Privacy Policy",
    content: "We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated 'Last Updated' date. Continued use of the application after modifications signifies your acceptance of the revised terms."
  }
];

function PolicySection({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-[#94A3B8] leading-relaxed">{content}</p>
    </section>
  );
}

export default function PrivacyScreen() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 overflow-y-auto pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#E2E8F0] tracking-tight">Privacy Policy</h1>
          <p className="text-[#94A3B8] text-sm mt-2 font-medium uppercase tracking-wider">Last Updated: June 2026</p>
        </div>

        <div className="space-y-8 bg-[#1E293B]/50 p-6 sm:p-8 rounded-2xl border border-slate-800">
          {PRIVACY_SECTIONS.map((section, index) => (
            <PolicySection key={index} title={section.title} content={section.content} />
          ))}
        </div>

        <div className="pt-6 border-t border-slate-700/50 text-sm text-[#64748B] text-center">
          <p>If you have any questions or require clarification about this Privacy Policy, please contact the official administration team via the QuestPad Telegram Bot.</p>
        </div>
      </div>
    </div>
  );
}
