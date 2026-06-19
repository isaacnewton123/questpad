import { useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { Link } from "react-router-dom";
import { PiUserCircle, PiShieldCheckFill } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import WalletSection from "../components/profile/wallet/WalletSection";
import BalanceSection from "../components/profile/balance/BalanceSection";
import ReferralSection from "../components/profile/ReferralSection";
import LegalSection from "../components/profile/LegalSection";

export default function ProfileScreen() {
  const { user, refetchUser } = useUser();
  const wallet = useTonWallet();

  useEffect(() => {
    if (wallet?.account.address) {
      apiFetch("/user/wallet", "POST", {
        wallet_address: wallet.account.address,
      })
        .then(() => refetchUser())
        .catch(console.error);
    }
  }, [wallet?.account.address, refetchUser]);

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiUserCircle /> Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {user?.username ?? "Loading..."}
        </p>
      </header>

      {user?.is_admin && <AdminLink />}
      <WalletSection wallet={wallet} />
      <BalanceSection user={user} refetchUser={refetchUser} />
      <ReferralSection />
      <LegalSection />
    </div>
  );
}

function AdminLink() {
  return (
    <Link
      to="/admin"
      className="bg-emerald-50 text-emerald-600 rounded-xl p-3 flex items-center justify-between shadow-sm border border-emerald-100 hover:bg-emerald-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        <PiShieldCheckFill size={20} />
        <span className="font-bold text-sm">Admin Dashboard</span>
      </div>
      <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md shadow-sm">
        Review Proofs →
      </span>
    </Link>
  );
}
