import { PiArrowLeft } from "react-icons/pi";

export default function AdminHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 text-slate-400"
          >
            <PiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
