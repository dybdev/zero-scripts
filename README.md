# Zero Scripts Storefront

A production-oriented, headless Tebex storefront for FiveM resources. It uses
the Next.js App Router, strict TypeScript, Tailwind CSS, TanStack Query, Zustand,
Zod, Motion, and Lucide icons.

## Quick start

Requirements: Node.js 20.9 or newer and pnpm 9.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

The default `TEBEX_DATA_SOURCE=mock` mode includes a realistic catalogue and
local basket interactions, so every public route can be tested without
credentials.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Tebex integration

1. Set `TEBEX_DATA_SOURCE=tebex`.
2. Set the server-only `TEBEX_WEBSTORE_TOKEN`.
3. Set the server-only `TEBEX_PRIVATE_KEY` for authenticated basket requests.
4. Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin.
5. For Discord login, create an application in the Discord Developer Portal,
   set `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`, and register
   `{NEXT_PUBLIC_SITE_URL}/api/auth/discord/callback` as an OAuth2 redirect.
6. Review the raw Tebex catalogue mapping in
   `src/lib/tebex/client.ts` against your live package fields, category
   structure, and image host.
7. Configure the official community/support URLs in the footer and support
   page before launch.

The browser never receives the Tebex token. Catalogue reads occur through the
server adapter, and all basket mutations are validated by Zod in
`src/app/api/tebex/basket/route.ts`. Real checkout redirects only to the
`links.checkout` URL returned by Tebex. Mock mode never simulates a successful
payment.

Account purchase history requires the official Tebex basket authentication flow
for the chosen FiveM identity provider. That integration point is intentionally
isolated from local UI state and is not represented as a fake sign-in.

Checkout requires both a verified Discord OAuth session and the Tebex-managed
FiveM/CFX basket identity. The verified Discord ID is sent to Tebex as
`variable_data.discord_id`, allowing configured Discord package actions to be
delivered by the official Tebex bot after a successful payment.

## Architecture

- `src/app/(storefront)`: public pages, loading, and error boundaries
- `src/app/api/tebex`: server-only catalogue and basket handlers
- `src/components`: brand, basket, catalogue, layout, product, and UI primitives
- `src/lib/tebex`: schemas, types, mock data, and swappable adapters
- `src/stores`: persisted local basket/UI state with selector-based subscriptions
- `src/providers`: TanStack Query client boundary

Poppins is loaded once with `next/font/google`. Brand assets live in
`public/brand`; their source proportions and colors are untouched. Product
artwork is code-native and uses the supplied logo, category iconography, and
subtle grid texture, keeping the storefront fast and visually consistent
without decorative raster artwork.

Toast feedback is provided by React Toastify with project-specific styling,
icons, timing, focus behavior, and reduced visual noise.
