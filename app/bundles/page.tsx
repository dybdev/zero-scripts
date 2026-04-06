'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/store/useCartStore';
import { ProductCard } from '@/components/store/ProductCard';
import gsap from 'gsap';

export default function BundlesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/tebex/packages');
        const data = await res.json();
        // Filter for bundles
        const bundleProducts = (data.data || []).filter((p: Product) => {
          const catName = typeof p.category === 'object' ? p.category?.name : p.category;
          return p.name.toLowerCase().includes('bundle') || catName?.toLowerCase().includes('bundle');
        });
        setProducts(bundleProducts);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: 'power2.out' 
        }
      );
    }
  }, [isLoading]);

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-4">
          Script <span className="text-primary">Bundles</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Save money by purchasing our curated script bundles.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-card opacity-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-xl">No bundles available at the moment.</p>
        </div>
      )}
    </div>
  );
}
