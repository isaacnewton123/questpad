import { useState, useEffect, useRef } from "react";
import type { AdProvider } from "./useAds";

type ShowAdFn = () => Promise<{ success: boolean; provider?: AdProvider }>;

function useAdClickHandler(
  showRewardedAd: ShowAdFn,
  refetchUser: () => void,
  setVerifying: (v: boolean) => void
) {
  return async () => {
    const { success } = await showRewardedAd();
    if (success) {
      setVerifying(true);
      setTimeout(refetchUser, 2000);
      setTimeout(refetchUser, 5000);
      setTimeout(() => {
        refetchUser();
        setVerifying(false);
      }, 9000);
    }
  };
}

export function useAdVerification(
  adWatches: number,
  maxAdWatches: number,
  showRewardedAd: ShowAdFn,
  refetchUser: () => void
) {
  const [verifyingAd, setVerifyingAd] = useState(false);
  const handleAdClick = useAdClickHandler(showRewardedAd, refetchUser, setVerifyingAd);

  const prevAdWatches = useRef(adWatches);
  useEffect(() => {
    if (adWatches > prevAdWatches.current) {
      setVerifyingAd(false);
    }
    prevAdWatches.current = adWatches;
  }, [adWatches]);

  return { verifyingAd, handleAdClick, adRemaining: maxAdWatches - adWatches };
}
