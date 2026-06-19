import { PiCheckCircleFill, PiClockCountdownFill } from "react-icons/pi";
import type { Friend } from "../../types/referral.types";

export default function FriendsList({
  total,
  friends,
  loading,
}: {
  total: number;
  friends: Friend[];
  loading: boolean;
}) {
  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
        <span>Invited Friends</span>
        <span className="text-xs font-normal text-slate-500">
          {total} Total
        </span>
      </h2>

      <div className="bg-blue-50/50 border border-blue-100/50 p-3 rounded-xl mb-4 text-[11px] text-slate-600">
        <strong className="text-blue-600 block mb-0.5">
          What is a Qualified Referral?
        </strong>
        Your friend must connect a wallet, complete the main QuestPad Official
        campaign, and watch 3 ads to become Qualified.
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-4">
          Loading friends...
        </p>
      ) : friends.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">
          You haven't invited anyone yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {friends.map((f, i) => (
            <FriendRow key={i} friend={f} />
          ))}
        </div>
      )}
    </div>
  );
}

function FriendRow({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
      <div>
        <p className="text-sm font-bold text-slate-700">{friend.username}</p>
        <p className="text-[10px] text-slate-400">
          Joined {new Date(friend.joined_at).toLocaleDateString()}
        </p>
      </div>
      {friend.is_qualified ? (
        <div className="flex items-center gap-1 text-emerald-500">
          <PiCheckCircleFill size={16} />
          <span className="text-xs font-bold">Qualified</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-slate-400">
          <PiClockCountdownFill size={16} />
          <span className="text-xs font-bold">Pending Actions</span>
        </div>
      )}
    </div>
  );
}
