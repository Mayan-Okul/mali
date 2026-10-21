<div align="center">

# Mali

**The AI-powered business OS for African shops.**
Know what to reorder, who owes you, and why your profit moved.

[**Live demo**](https://mali-mnyapola.netlify.app) · [Report a bug](https://github.com/Mayan-Okul/mali/issues) · [Roadmap](#roadmap)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)

</div>

---

## Why Mali

Most small retail shops in Africa run on a notebook, M-Pesa messages and memory. Stock runs out without warning, credit (*deni*) goes untracked, and nobody can say why this week's profit is lower than last week's.

Mali turns the shop's own records into plain-language advice, so the owner spends less time counting and more time selling.

## Features

| | |
|---|---|
| **Smart insights** | Reorder alerts, slow-moving stock, profit trend and debtor summaries, generated from the shop's own data. |
| **Deni tracking** | See every customer who owes you, sorted by balance. |
| **Live dashboard** | Sales, profit, expenses and revenue trend in one view. |
| **Secure accounts** | Email and password sign-in. Each shop only ever sees its own data (Postgres Row Level Security). |
| **Auto shop setup** | Signing up creates your shop automatically. |
| **AI-ready** | Rule-based insights work today. An optional Anthropic-powered layer plugs in through a serverless proxy. |

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS v4, Recharts, Lucide
- **Backend:** Supabase (Postgres, Auth, Row Level Security)
- **Hosting:** Netlify, auto-deployed from `main`
- **AI:** Netlify Function proxy to the Anthropic API (optional)

## Getting started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/Mayan-Okul/mali.git
cd mali
npm install
```

### 2. Set up the database

In the Supabase **SQL Editor**, run the schema file `0001_init_schema.sql`. It creates the `shops`, `products`, `customers`, `sales` and `expenses` tables, their Row Level Security policies, and the signup trigger that creates a shop for each new user.

### 3. Add environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are in Supabase under **Project Settings → API**. `.env.local` is gitignored, so never commit it.

### 4. Configure Auth

In Supabase **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:5173` (use your Netlify URL in production)
- **Redirect URLs:** `http://localhost:5173` and your Netlify URL

### 5. Run

```bash
npm run dev
```

Open <http://localhost:5173>, sign up, and your empty shop is ready.

## Project structure

```
src/
├── App.jsx                  Auth gate: loading → dashboard or login
├── main.jsx                 App entry, wraps the app in AuthProvider
├── context/
│   └── AuthContext.jsx      useAuth(): session, signIn, signUp, signOut
├── lib/
│   ├── supabaseClient.js    Supabase client
│   ├── useShopData.js       Loads the shop's rows from Supabase
│   ├── insights.js          Rule-based insight engine
│   └── aiClient.js          Optional AI insights with rule-based fallback
├── pages/
│   ├── AuthPage.jsx         Login and sign-up
│   └── Dashboard.jsx        Main dashboard
└── components/
    └── InsightCard.jsx      Insight row UI

netlify/functions/insights.js   Serverless proxy for the Anthropic API
netlify.toml                    Netlify build and function config
```

## How the insights work

`useShopData` loads the shop's products, customers, sales and expenses from Supabase and maps them to the shape `insights.js` expects. The engine then produces:

- **Reorder alerts:** products at or below their reorder level
- **Slow movers:** products that barely sold recently
- **Profit trend:** this week against last week, with the main reason for the change
- **Debtors:** who owes the most

If an AI key is configured, `aiClient.js` asks the model for richer advice. Without one, the rule-based results are shown, so the dashboard never breaks.

## Deployment

Netlify deploys on every push to `main`.

1. Connect the repository in Netlify. Build command: `npm run build`, publish directory: `dist`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site configuration → Environment variables**.
3. *(Optional)* Add `ANTHROPIC_API_KEY` to turn on AI insights. The key stays on the server in the Netlify Function and is never exposed to the browser.

## Security

- The anon key is safe in the browser **only because** Row Level Security is enabled on every table. Do not turn it off.
- Never commit `.env.local` or any service-role key.
- Rotate any credential that has been shared in plain text.

## Roadmap

- [x] Supabase schema with Row Level Security
- [x] Email and password auth with automatic shop creation
- [x] Dashboard fed by real shop data
- [x] Rule-based insights with an AI fallback layer
- [ ] New dashboard and login design
- [ ] Products, Sales, Customers and Expenses pages (add, edit, delete)
- [ ] Record Deni payments
- [ ] M-Pesa transaction import
- [ ] Email confirmation on signup
- [ ] Swahili interface
- [ ] Offline-first sales entry

## Contributing

Issues and pull requests are welcome. Keep one logical change per commit, and make sure `npm run build` passes before opening a PR.

## Author

Built by **Mayan Okul** in Kisumu, Kenya. Follow the build on [GitHub](https://github.com/Mayan-Okul).

---

<div align="center">

*Mali is Swahili for wealth and goods.*

</div>