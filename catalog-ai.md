# AI Catalog — QuestPad Frontend

## Core Context
- **Project**: QuestPad Frontend (Telegram Mini App)
- **Stack**: React 19 + Vite 8 + Tailwind v4 + TypeScript 6
- **State**: Refactored. Tree-branch folder structure. All guardrails passing.

## Architecture

### Routing
- React Router v7 with 11 routes defined in `App.tsx`
- Admin routes (`/admin/*`) and legal routes hide the `BottomNav`

### Global State
- `UserContext.tsx` calls `POST /auth/verify` on mount
- Exposes `user`, `loading`, `error`, `refetchUser` via `useUser()`

### API Layer
- `lib/api.ts`: `apiFetch()` with `x-telegram-init-data` header
- `lib/supabase.ts`: Read-only client (spin_config only)

## File Tree

```
src/
├── components/
│   ├── ui/                     # Shared primitives
│   │   ├── BalanceBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── LoadingView.tsx
│   │   └── RewardBadge.tsx
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── proof/
│   │   │   ├── AdminProofsTab.tsx
│   │   │   └── SubmissionCard.tsx
│   │   ├── withdrawal/
│   │   │   ├── AdminWithdrawalsTab.tsx
│   │   │   └── AdminHistoryTab.tsx
│   │   └── campaign/
│   │       └── AdminCampaignsTab.tsx
│   ├── spin/
│   │   ├── SpinWheel.tsx
│   │   ├── SpinHeader.tsx
│   │   ├── SpinBadges.tsx
│   │   ├── SpinControls.tsx
│   │   ├── WheelArea.tsx
│   │   ├── ResultModal.tsx
│   │   └── CooldownTimer.tsx
│   ├── quest/
│   │   ├── DailySection.tsx
│   │   ├── OfficialSection.tsx
│   │   ├── QuestCard.tsx
│   │   ├── CheckInSuccessModal.tsx
│   │   └── ProofModal.tsx
│   ├── campaign/
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignHeader.tsx
│   │   ├── CampaignMetadataBar.tsx
│   │   ├── CampaignStepList.tsx
│   │   ├── CampaignInteractions.tsx
│   │   ├── ClaimSection.tsx
│   │   ├── StepCard.tsx
│   │   └── CountdownBadge.tsx
│   ├── profile/
│   │   ├── ReferralModal.tsx
│   │   ├── ReferralSection.tsx
│   │   ├── LegalSection.tsx
│   │   ├── wallet/
│   │   │   └── WalletSection.tsx
│   │   └── balance/
│   │       ├── BalanceSection.tsx
│   │       ├── BalanceDisplay.tsx
│   │       └── WithdrawalButton.tsx
│   ├── referral/
│   │   ├── MyProgressTab.tsx
│   │   ├── ProgressTierBar.tsx
│   │   ├── FriendsList.tsx
│   │   ├── InviteLinkSection.tsx
│   │   └── LeaderboardTab.tsx
│   └── store/
│       └── StoreCard.tsx
├── screens/           # Route-level pages (all ≤77 lines)
├── hooks/             # Custom hooks (6 files)
├── types/             # Shared TypeScript interfaces
├── lib/               # API + Supabase clients
├── context/           # UserContext global state
└── constants/         # Static data (terms, privacy)
```

## Max Files Per Folder
| Folder | Files |
|---|---|
| components/campaign/ | 8 |
| components/spin/ | 7 |
| components/quest/ | 5 |
| components/referral/ | 5 |
| components/ui/ | 4 |
| components/profile/ | 3 + 2 subfolders |
| components/admin/ | 1 + 3 subfolders |
| components/store/ | 1 |

## AI Guardrails Compliance
- `eslint-plugin-ai-guardrails` enforced in CI/CD
- Max 300 lines per file — **largest is 220 lines** ✅
- Max 50 lines per function ✅
- Comment density ≤ 20% ✅
- No orphan TODOs, no commented-out code ✅
