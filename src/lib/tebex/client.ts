import "server-only";

import { env } from "@/lib/env";
import { slugify } from "@/lib/utils";

import { mockCategories, mockProducts, mockStore } from "./mock-data";
import { tebexBasketSchema, tebexEnvelopeSchema } from "./schemas";
import type {
  CatalogueAdapter,
  Category,
  CreateBasketInput,
  Product,
  StoreInfo,
  TebexBasket,
} from "./types";

function mockBasket(): TebexBasket {
  return {
    ident: "mock-basket",
    currency: "USD",
    total: 0,
    lines: [],
  };
}

export const mockAdapter: CatalogueAdapter = {
  async getStore() {
    return mockStore;
  },
  async getCategories() {
    return mockCategories;
  },
  async getPackages() {
    return mockProducts;
  },
  async getPackage(idOrSlug) {
    return (
      mockProducts.find(
        (product) => product.id === idOrSlug || product.slug === idOrSlug,
      ) ?? null
    );
  },
  async createBasket() {
    return mockBasket();
  },
  async getAuthenticationLinks() {
    return [];
  },
  async getBuyerIdentity() {
    return null;
  },
  async addPackage() {
    return mockBasket();
  },
  async removePackage() {
    return mockBasket();
  },
  async applyCoupon() {
    return mockBasket();
  },
  async applyCreatorCode() {
    return mockBasket();
  },
  async getCheckout() {
    return mockBasket();
  },
};

function toBasket(value: unknown): TebexBasket {
  const raw = tebexBasketSchema.parse(value);
  return {
    ident: raw.ident,
    currency: raw.currency,
    total: raw.total_price,
    checkoutUrl: raw.links?.checkout ?? undefined,
    lines: raw.packages.map((line, index) => {
      const packageId = line.id ?? line.package_id ?? String(index);
      return {
        id: packageId,
        packageId,
        name: line.name,
        quantity: line.quantity ?? line.qty ?? 1,
        price: line.price ?? line.base_price ?? 0,
      };
    }),
  };
}

class TebexAdapter implements CatalogueAdapter {
  private readonly token: string;
  private readonly privateKey?: string;
  private readonly baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.privateKey = env.TEBEX_PRIVATE_KEY;
    this.baseUrl = env.TEBEX_API_BASE_URL.replace(/\/$/, "");
  }

  private async request(
    path: string,
    init?: RequestInit,
    accountScoped = true,
  ): Promise<unknown> {
    const prefix = accountScoped ? `/accounts/${this.token}` : "";
    const response = await fetch(`${this.baseUrl}${prefix}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(this.privateKey && accountScoped
          ? {
              Authorization: `Basic ${Buffer.from(
                `${this.token}:${this.privateKey}`,
              ).toString("base64")}`,
            }
          : {}),
        ...init?.headers,
      },
      next:
        init?.method || init?.cache === "no-store"
          ? undefined
          : { revalidate: 60 },
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `Tebex request failed with status ${response.status}${
          details ? `: ${details.slice(0, 500)}` : ""
        }`,
      );
    }

    const json: unknown = await response.json();
    const envelope = tebexEnvelopeSchema.safeParse(json);
    return envelope.success ? envelope.data.data : json;
  }

  async getStore(): Promise<StoreInfo> {
    return mockStore;
  }

  async getCategories(): Promise<Category[]> {
    const raw = await this.request("/categories");
    if (!Array.isArray(raw)) return [];
    return raw.map((entry, index) => {
      const item = entry as Record<string, unknown>;
      const name = String(item.name ?? "Category");
      return {
        id: String(item.id ?? index),
        slug: slugify(name),
        name,
        description: String(item.description ?? ""),
        icon: "code",
        productCount: Array.isArray(item.packages) ? item.packages.length : 0,
      };
    });
  }

  async getPackages(): Promise<Product[]> {
    const raw = await this.request("/packages");
    if (!Array.isArray(raw)) return [];
    return raw.map((entry, index) => {
      const item = entry as Record<string, unknown>;
      const name = String(item.name ?? "Package");
      const categoryValue = item.category;
      const category =
        categoryValue &&
        typeof categoryValue === "object" &&
        "name" in categoryValue
          ? String((categoryValue as Record<string, unknown>).name)
          : typeof categoryValue === "string"
            ? categoryValue
            : "Standalone";
      const image = typeof item.image === "string" ? item.image : "";
      const media = Array.isArray(item.media)
        ? item.media.flatMap((entry) => {
            if (!entry || typeof entry !== "object") return [];
            const mediaItem = entry as Record<string, unknown>;
            const url = mediaItem.url;
            const type =
              typeof mediaItem.type === "string"
                ? mediaItem.type.toLowerCase()
                : "";
            const isImage =
              type === "image" ||
              (typeof url === "string" &&
                /\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(url));
            return typeof url === "string" && url && isImage ? [url] : [];
          })
        : [];
      const gallery = Array.from(new Set([image, ...media])).filter(Boolean);
      return {
        ...mockProducts[0],
        id: String(item.id ?? index),
        slug:
          typeof item.slug === "string" && item.slug
            ? item.slug
            : slugify(name),
        name,
        category,
        categorySlug: slugify(category),
        description: String(item.description ?? ""),
        descriptionHtml: String(item.description ?? ""),
        price: Number(item.total_price ?? item.base_price ?? 0),
        currency:
          typeof item.currency === "string" && item.currency
            ? item.currency
            : mockProducts[0].currency,
        image,
        gallery,
        featured: false,
        newestRank: index,
      };
    });
  }

  async getPackage(idOrSlug: string): Promise<Product | null> {
    const products = await this.getPackages();
    return (
      products.find(
        (product) => product.id === idOrSlug || product.slug === idOrSlug,
      ) ?? null
    );
  }

  async createBasket(input: CreateBasketInput): Promise<TebexBasket> {
    const raw = await this.request("/baskets", {
      method: "POST",
      body: JSON.stringify({
        complete_url: input.completeUrl,
        cancel_url: input.cancelUrl,
        complete_auto_redirect: true,
        ...(input.ipAddress ? { ip_address: input.ipAddress } : {}),
      }),
    });
    return toBasket(raw);
  }

  async getAuthenticationLinks(basketId: string, returnUrl: string) {
    const raw = await this.request(
      `/baskets/${encodeURIComponent(basketId)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
    );
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Record<string, unknown>;
      const name = typeof item.name === "string" ? item.name : "";
      const url = typeof item.url === "string" ? item.url : "";
      return name && url ? [{ name, url }] : [];
    });
  }

  async getBuyerIdentity(basketId: string, provider: "cfx" | "discord") {
    const raw = await this.request(`/baskets/${encodeURIComponent(basketId)}`, {
      cache: "no-store",
    });
    if (!raw || typeof raw !== "object") return null;
    const basket = raw as Record<string, unknown>;
    const displayName =
      typeof basket.username === "string" ? basket.username.trim() : "";
    const usernameId =
      typeof basket.username_id === "string" ||
      typeof basket.username_id === "number"
        ? String(basket.username_id)
        : undefined;
    return displayName ? { displayName, provider, usernameId } : null;
  }

  async addPackage(
    basketId: string,
    packageId: string,
    quantity = 1,
    variableData?: Record<string, string>,
  ): Promise<TebexBasket> {
    const raw = await this.request(
      `/baskets/${basketId}/packages`,
      {
        method: "POST",
        body: JSON.stringify({
          package_id: packageId,
          quantity,
          ...(variableData && Object.keys(variableData).length
            ? { variable_data: variableData }
            : {}),
        }),
      },
      false,
    );
    return toBasket(raw);
  }

  async removePackage(
    basketId: string,
    packageId: string,
    quantity = 1,
  ): Promise<TebexBasket> {
    const raw = await this.request(
      `/baskets/${basketId}/packages/remove`,
      {
        method: "POST",
        body: JSON.stringify({ package_id: packageId, quantity }),
      },
      false,
    );
    return toBasket(raw);
  }

  async applyCoupon(basketId: string, code: string): Promise<TebexBasket> {
    const raw = await this.request(`/baskets/${basketId}/coupons`, {
      method: "POST",
      body: JSON.stringify({ coupon_code: code }),
    });
    return toBasket(raw);
  }

  async applyCreatorCode(basketId: string, code: string): Promise<TebexBasket> {
    const raw = await this.request(`/baskets/${basketId}/creator-codes`, {
      method: "POST",
      body: JSON.stringify({ creator_code: code }),
    });
    return toBasket(raw);
  }

  async getCheckout(basketId: string): Promise<TebexBasket> {
    return toBasket(await this.request(`/baskets/${basketId}`));
  }
}

export function getCatalogueAdapter(): CatalogueAdapter {
  if (env.TEBEX_DATA_SOURCE === "tebex") {
    if (!env.TEBEX_WEBSTORE_TOKEN) {
      throw new Error(
        "TEBEX_WEBSTORE_TOKEN is required when TEBEX_DATA_SOURCE=tebex",
      );
    }
    return new TebexAdapter(env.TEBEX_WEBSTORE_TOKEN);
  }
  return mockAdapter;
}
