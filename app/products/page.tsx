'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/store/useCartStore';
import { ProductCard } from '@/components/store/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import gsap from 'gsap';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/tebex/packages');
        const data = await res.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(
        products
          .map((product) => (typeof product.category === 'object' ? product.category?.name : product.category))
          .filter(Boolean)
      )
    ) as string[];

    return ['All', ...dynamicCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
      const categoryMatch = activeCategory === 'All' || categoryName === activeCategory;
      const searchMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, activeCategory, searchQuery]);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  }, [isLoading, searchQuery, activeCategory, products.length]);

  return (
    <div className="min-h-screen bg-[#050505] py-24">
      <section className="bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                All <span className="text-primary">Products</span>
              </h1>
              <p className="text-zinc-400 max-w-xl">
                Browse our complete collection of premium scripts. Filter by category and find exactly what your server needs.
              </p>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search scripts..."
                className="pl-12 h-12 rounded-xl bg-[#050505] border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transform-gpu transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.035] hover:shadow-[0_20px_40px_-20px_rgba(255,42,42,0.95)] ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-[0_0_18px_-6px_rgba(255,42,42,0.85)] hover:bg-[#ff3d3d]'
                    : 'bg-[#080505] text-zinc-200 border border-primary/35 hover:text-white hover:bg-primary/20 hover:border-primary/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-[#050505] border border-white/5" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card opacity-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#050505] rounded-2xl border border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No scripts found</h3>
              <p className="text-zinc-500 max-w-md">
                We could not find any scripts matching your current filters. Try adjusting your search query or selected category.
              </p>
              <Button
                variant="outline"
                className="mt-8 border-white/20 bg-transparent text-white hover:bg-primary/10"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
