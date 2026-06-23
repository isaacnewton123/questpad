# QuestPad Frontend

Telegram Mini App frontend for **QuestPad** — a play-to-earn quest platform on the TON blockchain. Built with React 19, Vite, Tailwind CSS v4, and TypeScript.

## Tech Stack

- **Framework:** React 19 + TypeScript 6
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router v7
- **Wallet:** TON Connect UI React v3
- **Telegram SDK:** `@twa-dev/sdk` v8
- **Icons:** Phosphor Icons (`react-icons/pi`)
- **Linting:** ESLint 10 + `eslint-plugin-ai-guardrails`
- **Database Client:** Supabase JS (read-only, for spin config)

## Prerequisites

- [Bun](https://bun.sh/) or Node.js 20+
- Supabase project (for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)

## Setup

```bash
cd Frontend
bun install
cp .env.local.example .env.local  # fill in your env vars
bun run dev
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Typecheck + lint + production build |
| `bun run lint` | ESLint with AI guardrails |
| `bun run typecheck` | TypeScript strict type checking |
| `bun run preview` | Preview production build locally |

## Project Structure

```
src/
├── App.tsx              # Router + layout
├── main.tsx             # Entry point (TonConnect + React)
├── index.css            # Tailwind v4 + design tokens
├── components/
│   ├── ui/              # Shared: BottomNav, BalanceBar, LoadingView, RewardBadge
│   ├── admin/           # Admin panel (proof/, withdrawal/, campaign/)
│   ├── spin/            # Spin wheel engine
│   ├── quest/           # Daily + official quest components
│   ├── campaign/        # Campaign detail components
│   ├── profile/         # Profile page (wallet/, balance/)
│   ├── referral/        # Invite + leaderboard
│   └── store/           # Store item card
├── screens/             # Route-level pages (all ≤77 lines)
├── hooks/               # Custom React hooks
├── types/               # Shared TypeScript interfaces
├── lib/                 # API client, Supabase client
├── context/             # UserContext (global state)
└── constants/           # Static data (terms, privacy)
```

## Key Screens

| Route | Screen | Description |
|---|---|---|
| `/` | ArcadeScreen | Game selection menu |
| `/quests` | QuestsScreen | Official global quest board |
| `/campaigns` | CampaignsScreen | Partner campaigns (FCFS/Raffle) |
| `/game/spin` | SpinScreen | Daily spin wheel, local store, and local missions |
| `/campaigns/:id` | CampaignDetailScreen | Multi-step campaign tasks |
| `/profile` | ProfileScreen | Wallet, balance, withdrawal |
| `/referrals` | ReferralsScreen | Invite link + leaderboard |
| `/withdrawals` | WithdrawalHistoryScreen | User payout history |
| `/admin` | AdminScreen | Admin panel (proofs/payouts/raffles) |

## AI Guardrails

This project uses `eslint-plugin-ai-guardrails` to enforce:
- Files ≤ 300 lines, functions ≤ 50 lines
- Comment density ≤ 20% of file lines
- No orphan TODOs without issue tracker links

See [agent.md](agent.md) for full rules.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_API_BASE` | Backend Edge Function base URL |
