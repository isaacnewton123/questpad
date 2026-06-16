import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import SpinScreen from "./screens/SpinScreen";
import QuestsScreen from "./screens/QuestsScreen";
import CampaignsScreen from "./screens/CampaignsScreen";
import CampaignDetailScreen from "./screens/CampaignDetailScreen";
import StoreScreen from "./screens/StoreScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";
import AdminApproveScreen from "./screens/AdminApproveScreen";
import ReferralsScreen from "./screens/ReferralsScreen";
import { useUser } from "./context/useUser";

export default function App() {
  const { loading, error } = useUser();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <>
      <Routes>
        <Route path="/" element={<SpinScreen />} />
        <Route path="/quests" element={<QuestsScreen />} />
        <Route path="/campaigns" element={<CampaignsScreen />} />
        <Route path="/campaigns/:id" element={<CampaignDetailScreen />} />
        <Route path="/store" element={<StoreScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/referrals" element={<ReferralsScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/admin/approve/:id" element={<AdminApproveScreen />} />
      </Routes>
      {!isAdminRoute && <BottomNav />}
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
