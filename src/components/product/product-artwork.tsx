import Image from "next/image";

import type { Product } from "@/lib/tebex/types";
import { cn } from "@/lib/utils";

export function ProductArtwork({
  product,
  src,
  className,
  priority = false,
}: {
  product: Product;
  src?: string;
  className?: string;
  priority?: boolean;
}) {
  const artwork = src ?? product.image;
  const hasArtwork =
    artwork.startsWith("/") || /^https:\/\/[^/]+\/.+/i.test(artwork);

  return (
    <div
      className={cn(
        "site-grid relative overflow-hidden bg-[#0e0e0e]",
        className,
      )}
    >
      {hasArtwork ? (
        <Image
          src={artwork}
          alt={`${product.name} product artwork`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <Image
          src="/brand/logo.png"
          alt=""
          width={1536}
          height={1024}
          priority={priority}
          className="absolute -right-[4%] -bottom-[16%] h-[92%] w-auto opacity-[0.075]"
        />
      )}
    </div>
  );
}
