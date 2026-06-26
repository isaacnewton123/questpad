import { useAds } from '../../hooks/useAds';
import { useUser } from '../../context/useUser';
import { useAdVerification } from '../useAdVerification';

export function useTreeAdsActions() {
  const { user, refetchUser } = useUser();
  const { showRewardedAd, isPlaying } = useAds(user?.telegram_id, "tree");

  const adWatches = user?.tree_ad_watches_today || 0;

  const adCheck = useAdVerification(
    adWatches,
    5, // max tree ads
    showRewardedAd,
    refetchUser
  );

  const handleQuest = () => {
    if (adWatches >= 5) {
      alert("You have reached your daily limit of 5 ads for the tree.");
      return;
    }
    adCheck.handleAdClick();
  };

  return {
    isAdPlaying: isPlaying || adCheck.verifyingAd,
    showAdSuccessModal: adCheck.showModal,
    setShowAdSuccessModal: adCheck.setShowModal,
    handleQuest
  };
}
