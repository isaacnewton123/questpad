import { useState } from "react";
import { Navigate } from "react-router-dom";
import { PiTicket, PiListChecks, PiWallet, PiClockCounterClockwise, PiTree } from "react-icons/pi";
import { useUser } from "../context/useUser";
import AdminHeader from "../components/admin/AdminHeader";
import AdminProofsTab from "../components/admin/proof/AdminProofsTab";
import { WithdrawalsTab } from "../components/admin/withdrawal/AdminWithdrawalsTab";
import { AdminHistoryTab } from "../components/admin/withdrawal/AdminHistoryTab";
import AdminCampaignsTab from "../components/admin/campaign/AdminCampaignsTab";
import AdminTreeTab from "../components/admin/tree/AdminTreeTab";

type AdminTab = "proofs" | "campaigns" | "withdrawals" | "history" | "tree";

const TAB_ITEMS = [
  { id: "proofs", icon: PiListChecks, label: "Proofs" },
  { id: "withdrawals", icon: PiWallet, label: "Payouts" },
  { id: "history", icon: PiClockCounterClockwise, label: "History" },
  { id: "campaigns", icon: PiTicket, label: "Raffles" },
  { id: "tree", icon: PiTree, label: "Tree" },
] as const;

export default function AdminScreen() {
  const { user } = useUser();
  const [tab, setTab] = useState<AdminTab>("proofs");
  if (!user?.is_admin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <AdminHeader />
      <div className="max-w-md mx-auto p-4 space-y-4 mt-2">
        {tab === "proofs" && <AdminProofsTab user={user} />}
        {tab === "withdrawals" && <WithdrawalsTab user={user} />}
        {tab === "history" && <AdminHistoryTab />}
        {tab === "campaigns" && <AdminCampaignsTab user={user} />}
        {tab === "tree" && <AdminTreeTab />}
      </div>
      <AdminNav tab={tab} setTab={setTab} />
    </div>
  );
}

function AdminNav({ tab, setTab }: { tab: AdminTab; setTab: (t: AdminTab) => void }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
      style={{
        borderRadius: "24px 24px 0 0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {TAB_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 transition-all duration-200 ${
              tab === item.id
                ? "text-blue-500 scale-105"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[9px] font-semibold tracking-wide">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
