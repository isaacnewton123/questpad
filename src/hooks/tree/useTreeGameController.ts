import { useState, useCallback } from 'react';
import { useTreeCoreActions } from './useTreeCoreActions';
import { useTreePvpActions } from './useTreePvpActions';
import { useTreeAdsActions } from './useTreeAdsActions';

export function useTreeGameController() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const coreActions = useTreeCoreActions();
  const pvpActions = useTreePvpActions();
  const adsActions = useTreeAdsActions();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleClaim = async () => {
    const res = await coreActions.claimCoins();
    if (res.success) {
      showToast(`Successfully claimed ${res.amount?.toFixed(2)} Coins!`);
    } else showToast(res.error || 'Failed to claim');
  };

  const handleWater = async () => {
    const res = await coreActions.waterTree();
    if (res.success) {
      if ((res.data as Record<string, unknown>)?.leveled_up) {
        showToast(`🎉 Tree leveled up to Level ${(res.data as Record<string, unknown>).tree_level}!`);
      } else {
        showToast(`Tree watered! (+${(res.data as Record<string, unknown>).total_poured} Water)`);
      }
    } else showToast(res.error || 'Failed to water');
  };

  const handleBuyWater = async () => {
    const res = await coreActions.buyWater();
    if (res.success) showToast(`Successfully bought 100 Water!`);
    else showToast(res.error || 'Failed to buy Water');
  };

  const handleSteal = async (targetId: number) => {
    const res = await pvpActions.stealCoins(targetId);
    if (res.success) showToast(`⚔️ Successfully stole ${(res.data as Record<string, unknown>)?.stolen_amount} Coins!`);
    else showToast(res.error || 'Failed to steal');
  };

  return {
    toastMessage,
    loading: coreActions.loading || pvpActions.loading,
    isAdPlaying: adsActions.isAdPlaying,
    handleQuest: adsActions.handleQuest,
    handleClaim,
    handleWater,
    handleBuyWater,
    handleSteal,
    searchPvp: pvpActions.searchPvp,
    showAdSuccessModal: adsActions.showAdSuccessModal,
    setShowAdSuccessModal: adsActions.setShowAdSuccessModal
  };
}
