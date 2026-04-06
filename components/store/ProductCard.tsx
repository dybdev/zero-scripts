'use client';

import { Product, useCartStore } from '@/store/useCartStore';
import { useCurrencyStore, CURRENCIES } from '@/store/useCurrencyStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

interface ProductCardProps {
  product: Product;
}

const OPEN_LOGIN_MODAL_EVENT = 'zs:open-login-modal';

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const { currency } = useCurrencyStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please sign in with Discord before adding products to cart.');
      window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT));
      return;
    }

    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const currencyData = CURRENCIES[currency] || CURRENCIES.USD;
  const displayPrice = ((product.price || 0) * currencyData.rate).toFixed(2);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(255,42,42,0.2)]">
        <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#111] text-zinc-600">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
          <div className="absolute left-4 top-4">
            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border border-white/10">
              {typeof product.category === 'object' ? product.category?.name : product.category}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h3 className="font-bold tracking-tight text-white text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
            <span className="font-mono font-bold text-white bg-white/5 px-2 py-1 rounded-md text-sm">
              {mounted ? `${currencyData.symbol}${displayPrice}` : `$${(product.price || 0).toFixed(2)}`}
            </span>
          </div>
          <p className="mb-6 line-clamp-2 text-sm text-zinc-400 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <Button 
              className="cursor-target w-full border border-[#ff2a2a]/40 bg-[#1d0a0a] text-white hover:border-[#ff3d3d] hover:bg-[#ff3d3d] hover:text-white transition-all duration-300 rounded-xl h-11"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
