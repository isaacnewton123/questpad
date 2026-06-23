import { NavLink } from "react-router-dom";
import {
  PiGameController,
  PiListChecks,
  PiRocketLaunch,
  PiUserCircle,
} from "react-icons/pi";

const TABS = [
  { to: "/", icon: PiGameController, label: "Arcade" },
  { to: "/quests", icon: PiListChecks, label: "Quests" },
  { to: "/campaigns", icon: PiRocketLaunch, label: "Campaigns" },
  { to: "/profile", icon: PiUserCircle, label: "Profile" },
] as const;

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
      style={{
        borderRadius: "24px 24px 0 0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-200 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-ink-soft hover:text-ink-mid"
              }`
            }
          >
            <tab.icon size={20} />
            <span className="text-[9px] font-semibold tracking-wide">
              {tab.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
