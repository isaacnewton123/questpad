import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { SiTon } from "react-icons/si";

type WalletType = ReturnType<typeof useTonWallet>;

export default function WalletSection({ wallet }: { wallet: WalletType }) {
  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3">TON Wallet</h2>
      {wallet ? (
        <div className="flex items-center gap-2 text-sm">
          <SiTon className="text-blue-500" size={16} />
          <span className="text-slate-600 font-mono text-xs truncate">
            {wallet.account.address.slice(0, 8)}...
            {wallet.account.address.slice(-6)}
          </span>
          <span className="text-emerald-500 text-xs font-semibold">
            Connected
          </span>
        </div>
      ) : (
        <TonConnectButton />
      )}
    </div>
  );
}
