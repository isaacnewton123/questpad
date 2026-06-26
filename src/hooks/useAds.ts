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
export type AdRewardType = "global" | "spin" | "tree";

export function useAds(userId?: number, adType: AdRewardType = "global") {
  const [isPlaying, setIsPlaying] = useState(false);

  const showRewardedAd = useCallback(async (): Promise<{ success: boolean; provider?: AdProvider }> => {
    if (isPlaying || !userId) return { success: false };
    setIsPlaying(true);

    const formattedUserId = `${userId}_${adType}`;

    try {
      // 1. Primary: Adsgram (High eCPM, Paid in TON)
      if (window.Adsgram) {
        try {
          // If we are showing a spin ad, we must use a separate block ID 
          // because Adsgram S2S webhooks don't support custom tracking tags.
          const blockId = adType === "spin" ? "36021" : adType === "tree" ? "36034" : "35408";
          
          const AdController = window.Adsgram.init({
            blockId,
          });
          
          // Adsgram doesn't have a direct way to pass dynamic user IDs.
          // In real implementation, pass it in URL for direct links.
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
          await window.show_11156930({ ymid: formattedUserId });
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
  }, [isPlaying, userId, adType]);

  return { showRewardedAd, isPlaying };
}
