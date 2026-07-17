# HALO AI Platform

**Voice Intelligence for Africa** — Enterprise-grade AI platform by HALO AI Technologies PLC.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5 (strict) |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 + shadcn/ui primitives |
| Animations | Framer Motion 11 |
| Routing | React Router v6 |
| State | Zustand 5 (persisted) |
| Server State | TanStack Query v5 |
| HTTP | Axios |
| Icons | Lucide React |
| Charts | Recharts |
| Markdown | react-markdown + remark-gfm |

## Quick Start

> **Windows users**: Run all commands in **PowerShell** or **CMD**, not WSL, to avoid Windows filesystem permission issues with npm.

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Type check
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   ├── layout/           # Sidebar, TopBar
│   └── ui/               # Reusable primitives (Button, Card, etc.)
├── layouts/
│   └── AppLayout.tsx     # Shell for authenticated app
├── pages/
│   ├── LandingPage.tsx
│   ├── DashboardPage.tsx
│   ├── ChatPage.tsx
│   ├── VoicePage.tsx
│   ├── KnowledgePage.tsx
│   ├── IVRPage.tsx
│   └── SettingsPage.tsx
├── router/               # React Router configuration
├── services/             # API layer (chatService, voiceService, etc.)
├── stores/               # Zustand stores (chat, voice, settings)
├── types/                # TypeScript interfaces
└── lib/
    └── utils.ts          # cn(), formatBytes(), etc.
```

## API Configuration

Configure your backend endpoints in **Settings → API Endpoints** or directly in `src/stores/settingsStore.ts`:

```ts
apiEndpoints: {
  chatApi:      'https://api.haloafrica.ai/v1',
  voiceApi:     'https://voice.haloafrica.ai/v1',
  knowledgeApi: 'https://knowledge.haloafrica.ai/v1',
  ivrApi:       'https://ivr.haloafrica.ai/v1',
}
```

All API keys are sent via `Authorization: Bearer <token>` from `localStorage.getItem('halo_token')`.

## Routes

| Path | Description |
|------|-------------|
| `/` | Public landing page |
| `/app/dashboard` | Dashboard with metrics & activity |
| `/app/chat` | ChatGPT-like interface with streaming |
| `/app/voice` | Voice recording, transcription & TTS |
| `/app/knowledge` | Document upload & RAG query |
| `/app/ivr` | IVR analytics, call logs & integrations |
| `/app/settings` | API config, preferences & organization |

---

© 2024 HALO AI Technologies PLC · [haloafrica.ai](https://haloafrica.ai)
