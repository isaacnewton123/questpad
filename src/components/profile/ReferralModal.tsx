import { Link } from "react-router-dom";
import { PiUsers, PiXCircle } from "react-icons/pi";

export default function ReferralModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"
        >
          <PiXCircle size={20} />
        </button>

        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PiUsers size={32} className="text-blue-600" />
        </div>

        <h3 className="text-xl font-black text-slate-800 text-center mb-2">
          Referrals Required
        </h3>

        <p className="text-sm text-slate-500 text-center mb-6 px-2">
          To withdraw your TON, you need to invite at least 3 friends who
          complete a quest.
        </p>

        <Link
          to="/referrals"
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          Go to Invite Page
        </Link>
      </div>
    </div>
  );
}
