export type ProductStatus = "Stable" | "Updated" | "New";

export interface StoreInfo {
  name: string;
  currency: string;
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: "code" | "cube" | "game" | "flag" | "shield" | "layout";
  productCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  descriptionHtml: string;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  status?: ProductStatus;
  version: string;
  lastUpdated: string;
  compatibility: string[];
  dependencies: string[];
  features: string[];
  requirements: string[];
  changelog: Array<{ version: string; date: string; notes: string }>;
  featured: boolean;
  newestRank: number;
  quantitySupported: boolean;
}

export interface BasketLine {
  id: string;
  packageId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TebexBasket {
  ident: string;
  currency: string;
  total: number;
  lines: BasketLine[];
  checkoutUrl?: string;
}

export interface CreateBasketInput {
  completeUrl: string;
  cancelUrl: string;
  ipAddress?: string;
}

export interface AuthenticationLink {
  name: string;
  url: string;
}

export interface BuyerIdentity {
  displayName: string;
  provider: "cfx" | "discord";
}

export interface CatalogueAdapter {
  getStore(): Promise<StoreInfo>;
  getCategories(): Promise<Category[]>;
  getPackages(): Promise<Product[]>;
  getPackage(idOrSlug: string): Promise<Product | null>;
  createBasket(input: CreateBasketInput): Promise<TebexBasket>;
  getAuthenticationLinks(
    basketId: string,
    returnUrl: string,
  ): Promise<AuthenticationLink[]>;
  getBuyerIdentity(
    basketId: string,
    provider: BuyerIdentity["provider"],
  ): Promise<BuyerIdentity | null>;
  addPackage(
    basketId: string,
    packageId: string,
    quantity?: number,
  ): Promise<TebexBasket>;
  removePackage(
    basketId: string,
    packageId: string,
    quantity?: number,
  ): Promise<TebexBasket>;
  applyCoupon(basketId: string, code: string): Promise<TebexBasket>;
  applyCreatorCode(basketId: string, code: string): Promise<TebexBasket>;
  getCheckout(basketId: string): Promise<TebexBasket>;
}
