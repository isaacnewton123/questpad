import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser";
import { apiFetch } from "../../lib/api";
import InviteLinkSection from "./InviteLinkSection";
import ProgressTierBar from "./ProgressTierBar";
import FriendsList from "./FriendsList";
import type { Friend } from "../../types/referral.types";

export default function MyProgressTab() {
  const { user } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [total, setTotal] = useState(0);
  const [qualified, setQualified] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ totalCount: number; qualifiedCount: number; friends: Friend[] }>(
      "/user/referrals",
    )
      .then(({ data }) => {
        setTotal(data.totalCount || 0);
        setQualified(data.qualifiedCount || 0);
        setFriends(data.friends || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <InviteLinkSection telegramId={user?.telegram_id ?? null} />
      <ProgressTierBar qualified={qualified} />
      <FriendsList total={total} friends={friends} loading={loading} />
    </div>
  );
}
