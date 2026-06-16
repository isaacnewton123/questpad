import { useCallback, useState } from "react";

declare global {
  interface Window {
    Adsgram?: {
      init(config: { blockId: string }): {
        show(): Promise<void>;
      };
    };
    show_11156930?: (config?: { ymid?: string | number }) => Promise<void>;
  }
}

export type AdProvider = "adsgram" | "monetag";

export function useAds(userId?: number) {
  const [isPlaying, setIsPlaying] = useState(false);

  const showRewardedAd = useCallback(async (): Promise<{ success: boolean; provider?: AdProvider }> => {
    if (isPlaying) return { success: false };
    setIsPlaying(true);

    try {
      // 1. Primary: Adsgram (High eCPM, Paid in TON)
      if (window.Adsgram) {
        try {
          const AdController = window.Adsgram.init({
            blockId: "35408",
          });
          
          await AdController.show();
          setIsPlaying(false);
          return { success: true, provider: "adsgram" };
        } catch (err) {
          console.warn("Adsgram failed to load. Falling back.", err);
          // Fall through to Monetag
        }
      }

      // 2. Fallback: Monetag (100% Fill Rate)
      if (window.show_11156930) {
        try {
          await window.show_11156930({ ymid: userId });
          setIsPlaying(false);
          return { success: true, provider: "monetag" };
        } catch (err) {
          console.error("Monetag also failed.", err);
        }
      }

      console.error("No ad inventory available.");
      setIsPlaying(false);
      return { success: false };

    } catch (error) {
      console.error("Critical error in ad delivery pipeline:", error);
      setIsPlaying(false);
      return { success: false };
    }
  }, [isPlaying, userId]);

  return { showRewardedAd, isPlaying };
}
