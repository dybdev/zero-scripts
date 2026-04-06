'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product, useCartStore } from '@/store/useCartStore';
import { useCurrencyStore, CURRENCIES } from '@/store/useCurrencyStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import gsap from 'gsap';

const OPEN_LOGIN_MODAL_EVENT = 'zs:open-login-modal';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const { currency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/tebex/packages');
        const data = await res.json();
        const found = data.data?.find((p: Product) => p.id === id);
        if (found) setProduct(found);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      gsap.fromTo(
        '.product-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please sign in with Discord before adding products to cart.');
      window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT));
      return;
    }

    if (product) {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-[600px] animate-pulse rounded-xl bg-white/5"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center text-white">
        <h1 className="text-4xl font-bold">Product not found</h1>
        <Link href="/">
          <Button className="mt-8 bg-primary text-white hover:bg-primary/90">Return Home</Button>
        </Link>
      </div>
    );
  }

  const currencyData = CURRENCIES[currency] || CURRENCIES.USD;
  const displayPrice = ((product.price || 0) * currencyData.rate).toFixed(2);
  const featureList = product.features?.length
    ? product.features
    : ['Highly optimized performance', 'Fully configurable', 'Open source UI', 'Dedicated support'];

  return (
    <div className="container mx-auto px-4 py-12 product-content text-white">
      <Link href="/" className="mb-8 inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: Image/Media */}
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#111] text-zinc-600">
                No Image Available
              </div>
            )}
          </div>
          
          {/* Optional YouTube Embed placeholder */}
          <div className="aspect-video w-full rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500">
            YouTube Showcase Video
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20 border-white/5">
              {typeof product.category === 'object' ? product.category?.name : product.category}
            </Badge>
            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>
            <div className="text-3xl font-mono font-medium text-primary">
              {mounted ? `${currencyData.symbol}${displayPrice}` : `$${(product.price || 0).toFixed(2)}`}
            </div>
          </div>

          <p className="mb-8 text-lg text-zinc-400 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8 space-y-4">
            <h3 className="text-lg font-semibold text-white">Features</h3>
            <ul className="space-y-3">
              {featureList.map((feature, i) => (
                <li key={i} className="flex items-center text-zinc-400">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <Button 
              size="lg" 
              className="cursor-target w-full text-lg h-14 border border-[#ff2a2a]/40 bg-[#ff2a2a] text-white hover:border-[#ff3d3d] hover:bg-[#ff3d3d] transition-all hover:shadow-[0_0_40px_-10px_rgba(255,42,42,0.55)] rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - {mounted ? `${currencyData.symbol}${displayPrice}` : `$${(product.price || 0).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
