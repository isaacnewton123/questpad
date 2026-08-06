import { PiArrowLeft } from "react-icons/pi";
import type { Campaign } from "../../hooks/useCampaignDetail";

export default function CampaignHeader({
  campaign,
  onBack,
}: {
  campaign: Campaign;
  onBack: () => void;
}) {
  return (
    <div className="px-4 pt-4">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 font-semibold mb-3 flex items-center gap-1
          active:scale-95 transition-transform"
      >
        <PiArrowLeft /> Back
      </button>
      <div className="flex items-center gap-3">
        {campaign.logo_url && (
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-white">
            <img
              src={campaign.logo_url}
              alt="Sponsor Logo"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-gradient">{campaign.title}</h1>
          {campaign.description && (
            <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">
              {campaign.description.split(/(`[^`]+`)/).map((part, i) => 
                part.startsWith('`') && part.endsWith('`') ? (
                  <span key={i} className="font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded text-[13px]">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  part
                )
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
