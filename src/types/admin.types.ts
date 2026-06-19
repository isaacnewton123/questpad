export interface Submission {
  id: string;
  userId: number;
  username: string;
  questTitle: string;
  proof: string;
  rewardType: string;
  rewardValue: number;
  campaignId: string;
  campaignTitle?: string;
}

export interface AdminCampaign {
  id: string;
  title: string;
  campaign_type: string;
  current_completions: number;
  max_completions: number | null;
  is_drawn: boolean;
  expires_at: string | null;
}

export interface AdminWithdrawal {
  id: string;
  amount_net: number;
  created_at: string;
  username: string;
  wallet_address: string;
  qualified_referrals: number;
}
