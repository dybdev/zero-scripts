import { NextResponse } from 'next/server';

interface TebexCategory {
  id: number;
  name: string;
}

interface TebexMediaItem {
  type?: string;
  url?: string;
  primary?: boolean;
}

interface TebexPackage {
  id: number | string;
  name: string;
  description?: string;
  category?: TebexCategory | null;
  image?: string | null;
  media?: TebexMediaItem[];
  total_price?: number;
  base_price?: number;
}

interface TebexPackagesResponse {
  data?: TebexPackage[];
}

const ZERO_SURVIVAL_HUD_DESCRIPTION =
  'A survival-focused FiveM HUD built for immersive RP and zombie servers, with clean visuals, fast updates, and framework-friendly integration that does not lock you into a specific core. Zero Survival Hud is plug-and-play, easy to adapt to custom state systems, and tuned for survival, hardcore RP, and apocalypse gameplay with clear information density and no screen clutter.';

const ZERO_SURVIVAL_HUD_FEATURES = [
  'Framework-ready support: Standalone, ESX, QBCORE, and QBOX',
  'Real-time vitals: Health, Armor, Stamina, Hunger, Thirst, Infection',
  'Condition indicators: Sick, Dizzy, Broken Bone, and Bleeding',
  'Smooth animated icon fill system for fast stat readability',
  'Dedicated stamina bar with live updates',
  'Voice HUD with mic proximity display and talking-state highlight',
  'Optional pma-voice auto integration with voice-mode syncing',
  'Dynamic vehicle HUD that appears automatically on vehicle entry',
  'Live speed display in km/h with progress bar and pointer',
  'Live fuel bar and engine condition warning states',
  'Vehicle damage behavior: stalling at severe damage and speed cap at moderate damage',
  'Automatic restoration of normal max speed after engine recovery',
  'Runtime API with client events and exports for framework/custom integrations',
  'Configurable key mapping for hunger, thirst, infection, injury, illness, and voice states',
  'Infection stage mapping support for staged infection systems',
  'Optional minimap hiding behavior',
  'Tunable update intervals for core HUD, vehicle HUD, and minimap checks',
  'Lightweight update loops with a clean modern NUI survival layout',
];

function shouldUseZeroSurvivalHudCopy(name: string): boolean {
  const normalized = name.trim().toLowerCase();

  if (normalized === 'open source') {
    return true;
  }

  if (normalized.includes('open source') && (normalized.includes('survival') || normalized.includes('hud') || normalized.includes('zero'))) {
    return true;
  }

  return /zero\s*survival\s*hud|survival\s*hud/i.test(name);
}

// Mock data fallback
const MOCK_PACKAGES = [
  {
    id: 'pkg_0',
    name: 'Zero Survival Hud',
    price: 18.99,
    description: ZERO_SURVIVAL_HUD_DESCRIPTION,
    features: ZERO_SURVIVAL_HUD_FEATURES,
    category: 'Standalone',
    image: 'https://picsum.photos/seed/survivalhud/400/300',
  },
  {
    id: 'pkg_0_open',
    name: 'Zero Survival Hud Open Source',
    price: 24.99,
    description: ZERO_SURVIVAL_HUD_DESCRIPTION,
    features: ZERO_SURVIVAL_HUD_FEATURES,
    category: 'Standalone',
    image: 'https://picsum.photos/seed/survivalhud-open/400/300',
  },
  {
    id: 'pkg_1',
    name: 'Advanced Police Job',
    price: 24.99,
    description: 'A comprehensive police job script with evidence system, dispatch, and more.',
    category: 'QBCore',
    image: 'https://picsum.photos/seed/police/400/300',
  },
  {
    id: 'pkg_2',
    name: 'Dynamic Housing',
    price: 34.99,
    description: 'Allow players to buy, furnish, and sell houses dynamically anywhere on the map.',
    category: 'ESX',
    image: 'https://picsum.photos/seed/housing/400/300',
  },
  {
    id: 'pkg_3',
    name: 'Custom Garage System',
    price: 19.99,
    description: 'Advanced garage system with vehicle sharing, impound, and visual damage saving.',
    category: 'Standalone',
    image: 'https://picsum.photos/seed/garage/400/300',
  },
  {
    id: 'pkg_4',
    name: 'Robbery Creator',
    price: 39.99,
    description: 'Create custom robberies with minigames, guards, and dynamic loot.',
    category: 'Qbox',
    image: 'https://picsum.photos/seed/robbery/400/300',
  },
];

function stripHtml(value: string | undefined): string {
  if (!value) return '';

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function mapTebexPackage(pkg: TebexPackage) {
  const primaryImage = pkg.media?.find((media) => media.type === 'image' && media.primary)?.url;
  const fallbackImage = pkg.media?.find((media) => media.type === 'image')?.url;
  const useZeroSurvivalHudCopy = shouldUseZeroSurvivalHudCopy(pkg.name);

  return {
    id: String(pkg.id),
    name: pkg.name,
    price: Number(pkg.total_price ?? pkg.base_price ?? 0),
    description: useZeroSurvivalHudCopy ? ZERO_SURVIVAL_HUD_DESCRIPTION : stripHtml(pkg.description),
    features: useZeroSurvivalHudCopy ? ZERO_SURVIVAL_HUD_FEATURES : undefined,
    category: pkg.category ?? { id: 0, name: 'Uncategorized' },
    image: pkg.image ?? primaryImage ?? fallbackImage,
  };
}

export async function GET() {
  try {
    const publicToken = process.env.TEBEX_PUBLIC_TOKEN;
    
    if (!publicToken) {
      // Fallback to mock data if no token is provided
      return NextResponse.json({ data: MOCK_PACKAGES });
    }

    const response = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/packages`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const message = `Failed to fetch packages from Tebex (status ${response.status})`;
      console.error(message);
      return NextResponse.json({ error: message, data: [] }, { status: 502 });
    }

    const payload = (await response.json()) as TebexPackagesResponse;
    const packages = Array.isArray(payload.data) ? payload.data.map(mapTebexPackage) : [];
    
    if (packages.length === 0) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error('Error fetching Tebex packages:', error);
    return NextResponse.json({ error: 'Failed to fetch Tebex packages', data: [] }, { status: 500 });
  }
}
