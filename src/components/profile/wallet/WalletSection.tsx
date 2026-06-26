import { TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { SiTon } from "react-icons/si";
import { PiSignOut } from "react-icons/pi";
import { useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useUser } from "../../../context/useUser";

type WalletType = ReturnType<typeof useTonWallet>;

export default function WalletSection({ wallet }: { wallet: WalletType }) {
  const [tonConnectUI] = useTonConnectUI();
  const { refetchUser } = useUser();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await apiFetch("/user/wallet", "DELETE");
      await tonConnectUI.disconnect();
      refetchUser();
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-700">TON Wallet</h2>
      </div>
      
      {wallet ? (
        <div className="flex items-center gap-2 text-sm">
          <SiTon className="text-blue-500" size={16} />
          <span className="text-slate-600 font-mono text-xs truncate">
            {wallet.account.address.slice(0, 8)}...
            {wallet.account.address.slice(-6)}
          </span>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-xs text-red-500 font-semibold bg-red-50 px-2.5 py-1.5 rounded-md active:scale-95 transition-transform ml-auto flex items-center gap-1.5"
          >
            <PiSignOut size={14} className={isDisconnecting ? "opacity-50" : ""} />
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      ) : (
        <TonConnectButton />
      )}
    </div>
  );
}
