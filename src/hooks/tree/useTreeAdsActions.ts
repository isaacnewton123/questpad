import { useState, useCallback } from 'react';
import { useAds } from '../../hooks/useAds';
import { useUser } from '../../context/useUser';
import type { GameState } from '../../types/tree';

export function useTreeAdsActions() {
  const { user } = useUser();
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [showAdSuccessModal, setShowAdSuccessModal] = useState(false);
  const { showRewardedAd } = useAds(user?.telegram_id, "tree");

  const handleQuest = useCallback(async (gameState: GameState) => {
    if (!user) return;
    if (gameState.tree_ad_watches_today >= 5) {
      alert("You have reached your daily limit of 5 ads for the tree.");
      return;
    }
    setIsAdPlaying(true);
    const result = await showRewardedAd();
    if (result.success) {
      setShowAdSuccessModal(true);
    } else {
      alert("No ads available right now. Please try again later.");
    }
    setIsAdPlaying(false);
  }, [user, showRewardedAd]);

  return {
    isAdPlaying,
    showAdSuccessModal,
    setShowAdSuccessModal,
    handleQuest
  };
}
