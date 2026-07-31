import { NextResponse } from "next/server";

import { getCatalogueAdapter } from "@/lib/tebex/client";

export async function GET() {
  try {
    const products = await getCatalogueAdapter().getPackages();
    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json(
      { message: "Unable to load packages from the catalogue." },
      { status: 502 },
    );
  }
}
