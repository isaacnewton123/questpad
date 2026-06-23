import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/ui/BottomNav";
import SpinScreen from "./screens/SpinScreen";
import QuestsScreen from "./screens/QuestsScreen";
import CampaignsScreen from "./screens/CampaignsScreen";
import ArcadeScreen from "./screens/ArcadeScreen";
import CampaignDetailScreen from "./screens/CampaignDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";
import AdminApproveScreen from "./screens/AdminApproveScreen";
import ReferralsScreen from "./screens/ReferralsScreen";
import WithdrawalHistoryScreen from "./screens/WithdrawalHistoryScreen";
import TermsScreen from "./screens/TermsScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import { useUser } from "./context/useUser";

export default function App() {
  const { loading, error } = useUser();
  const location = useLocation();
  const hideNav =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/game") ||
    location.pathname === "/terms" ||
    location.pathname === "/privacy";

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <>
      <Routes>
        <Route path="/" element={<ArcadeScreen />} />
        <Route path="/quests" element={<QuestsScreen />} />
        <Route path="/campaigns" element={<CampaignsScreen />} />
        <Route path="/game/spin" element={<SpinScreen />} />
        <Route path="/campaigns/:id" element={<CampaignDetailScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/referrals" element={<ReferralsScreen />} />
        <Route path="/withdrawals" element={<WithdrawalHistoryScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/admin/approve/:id" element={<AdminApproveScreen />} />
        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/privacy" element={<PrivacyScreen />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
      <div className="bg-animated" />
      <div className="w-12 h-12 rounded-full border-4 border-slate-200
        border-t-blue-500 animate-spin" />
      <p className="text-sm font-semibold text-slate-500">Loading QuestPad...</p>
    </div>
  );
}

import { PiWarningCircle } from "react-icons/pi";

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-8">
      <div className="bg-animated" />
      <PiWarningCircle size={48} className="text-amber-500" />
      <p className="text-sm font-semibold text-slate-700 text-center">
        {message}
      </p>
      <p className="text-xs text-slate-500 text-center">
        Please open QuestPad from Telegram
      </p>
    </div>
  );
}
