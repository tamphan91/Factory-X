# Factory-X

AI-Powered Logistics Control Tower dashboard (Next.js frontend in `frontend/`).

## Run locally

Prerequisites: Node.js 20+ and npm.

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create `frontend/.env.local`:

   ```env
   AUTH_SECRET=replace-with-a-random-string
   AUTH_URL=http://localhost:3000
   # Optional: "http" uses the real backend; anything else uses mock data
   # NEXT_PUBLIC_DATA_SOURCE=mock
   ```

   Generate a secret with `npx auth secret` or `openssl rand -base64 32`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Other scripts

Run from `frontend/`:

| Command | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
