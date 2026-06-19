import { Link } from "react-router-dom";

export default function LegalSection() {
  return (
    <div className="flex justify-center gap-4 text-xs font-medium text-slate-400 mt-2 mb-4">
      <Link to="/terms" className="text-blue-500 underline hover:text-blue-600 transition-colors">Terms of Use</Link>
      <span>•</span>
      <Link to="/privacy" className="text-blue-500 underline hover:text-blue-600 transition-colors">Privacy Policy</Link>
    </div>
  );
}
