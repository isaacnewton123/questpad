import { PiCheckCircle } from "react-icons/pi";

export default function CheckInSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 border-4 border-amber-50">
            <PiCheckCircle className="text-amber-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Check-in Complete!</h2>
          <p className="text-sm text-slate-500 mb-6">
            You've successfully checked in for today and earned <strong className="text-amber-500">50 Coins</strong>. Come back tomorrow for more!
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-sm shadow-amber-200"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
