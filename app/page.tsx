'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/store/useCartStore';
import { ProductCard } from '@/components/store/ProductCard';
import TrueFocus from '@/components/TrueFocus';
import DynamicText from '@/components/kokonutui/dynamic-text';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Code2, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS_REFRESH_MS = 60000;
const DISCORD_URL = 'https://discord.gg/AYUjHcEU';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/tebex/packages', { cache: 'no-store' });
        const data = await res.json();

        if (!isActive) return;

        const incomingProducts = Array.isArray(data.data) ? data.data : [];
        setProducts(incomingProducts);
        setLastSyncedAt(Date.now());
        setSecondsSinceSync(0);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    const intervalId = window.setInterval(fetchProducts, STATS_REFRESH_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!lastSyncedAt) return;

    const timerId = window.setInterval(() => {
      setSecondsSinceSync(Math.floor((Date.now() - lastSyncedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [lastSyncedAt]);

  const liveStats = useMemo(() => {
    const categories = new Set(
      products
        .map((product) => (typeof product.category === 'object' ? product.category?.name : product.category))
        .filter(Boolean)
    );

    const freeProducts = products.filter((product) => Number(product.price ?? 0) === 0).length;
    const paidProducts = Math.max(products.length - freeProducts, 0);
    const averagePrice = products.length
      ? products.reduce((sum, product) => sum + Number(product.price ?? 0), 0) / products.length
      : 0;

    return [
      {
        label: 'Live Packages',
        value: isLoading ? '...' : `${products.length}`,
        hint: 'Synced from Tebex',
      },
      {
        label: 'Paid Scripts',
        value: isLoading ? '...' : `${paidProducts}`,
        hint: `${freeProducts} free available`,
      },
      {
        label: 'Categories',
        value: isLoading ? '...' : `${categories.size}`,
        hint: `Avg price $${averagePrice.toFixed(2)}`,
      },
      {
        label: 'Last Sync',
        value: lastSyncedAt ? `${secondsSinceSync}s ago` : 'syncing...',
        hint: `Auto-refresh every ${STATS_REFRESH_MS / 1000}s`,
      },
    ];
  }, [isLoading, products, lastSyncedAt, secondsSinceSync]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-buttons', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, '-=1');

      if (statsRef.current) {
        gsap.fromTo(
          '.stat-item',
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          }
        );
      }

      if (featuresRef.current) {
        gsap.fromTo(
          '.feature-card',
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
          }
        );
      }

      if (faqRef.current) {
        gsap.fromTo(
          '.faq-item',
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: faqRef.current, start: 'top 85%' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const ctx = gsap.context(() => {
        if (featuredRef.current) {
          gsap.fromTo(
            '.featured-card',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: featuredRef.current, start: 'top 80%' },
            }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [isLoading, products]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-80 [background-image:linear-gradient(to_right,rgba(255,42,42,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,42,42,0.16)_1px,transparent_1px)] [background-size:32px_32px] [background-position:center_center] [mask-image:radial-gradient(ellipse_at_center,black_18%,black_58%,transparent_90%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(5,5,5,0.05)_0%,rgba(5,5,5,0.52)_65%,#050505_100%)]"
        />
        <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="hero-badge inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
            <DynamicText
              className="text-sm font-medium text-primary"
            />
          </div>

          <div className="hero-title mb-6 text-white uppercase">
            <h1 className="sr-only">Elevate Your Roleplay Server</h1>
            <div
              aria-hidden="true"
              className="flex justify-center text-primary [&_span]:text-4xl sm:[&_span]:text-6xl md:[&_span]:text-7xl [&_span]:tracking-tighter"
            >
              <TrueFocus
                sentence="Elevate Your Roleplay Server"
                blurAmount={2}
                borderColor="rgba(255,42,42,0.95)"
                glowColor="rgba(255,42,42,0.75)"
                animationDuration={0.45}
                pauseBetweenAnimations={1.2}
              />
            </div>
          </div>

          <p className="hero-desc mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            Premium, highly optimized, and fully configurable resources designed to bring your community&apos;s vision to life. Built for performance.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="cursor-target w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl"
              onClick={() => router.push('/products')}
            >
              Browse Scripts
            </Button>
            <Button
              size="lg"
              className="cursor-target w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl !bg-transparent hover:!bg-transparent !text-white !border !border-dashed !border-white/40 hover:!border-primary !shadow-none hover:!shadow-none transition-colors duration-200"
              onClick={() => window.open('https://docs.zeroscripts.net', '_blank', 'noopener,noreferrer')}
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-12  bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {liveStats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item rounded-2xl border border-white/10 bg-gradient-to-b from-black/70 to-[#0b0b0b] px-6 py-5 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <span className="text-3xl md:text-4xl font-black text-white mb-2 block">{stat.value}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block">{stat.label}</span>
                <span className="mt-2 text-xs text-primary/80 block">{stat.hint}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuredRef} className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Featured Products</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Our top-performing and most popular scripts.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-[#0a0a0a] border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <div key={`featured-${product.id}`} className="featured-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-6">Explore Our Full Catalog</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Discover dozens of premium scripts tailored for your framework. Take your server to the next level today.</p>
          <Button
            size="lg"
            className="cursor-target h-14 px-10 text-lg font-bold rounded-xl"
            onClick={() => router.push('/products')}
          >
            Browse All Scripts
          </Button>
        </div>
      </section>

      <section ref={featuresRef} className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Why Choose Us?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We don&apos;t just write code; we craft experiences. Here&apos;s why thousands of servers trust our resources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Highly Optimized', desc: '0.00ms resmon on idle. Our scripts are built from the ground up to ensure your server runs buttery smooth.' },
              { icon: Code2, title: 'Fully Configurable', desc: 'Don\'t like how something works? Change it. We provide extensive configuration files for every script.' },
              { icon: Shield, title: 'Dedicated Support', desc: 'Stuck on an issue? Our dedicated support team is available 24/7 in our Discord to help you out.' },
            ].map((feature) => (
              <div key={feature.title} className="feature-card bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl hover:border-primary/50 hover:shadow-[0_0_30px_-16px_rgba(255,42,42,0.7)] transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={faqRef} className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400">Got questions? We&apos;ve got answers.</p>
          </div>

          <Accordion className="w-full">
            <AccordionItem value="item-1" className="faq-item border-white/10">
              <AccordionTrigger className="text-white hover:text-primary transition-colors text-lg font-bold">How do I install the scripts?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base leading-relaxed">
                All of our scripts come with a detailed README file and a link to our comprehensive documentation. Simply drag and drop the resource into your server, configure it to your liking, and ensure your framework dependencies are met.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="faq-item border-white/10">
              <AccordionTrigger className="text-white hover:text-primary transition-colors text-lg font-bold">What frameworks are supported?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base leading-relaxed">
                We primarily support QBCore, ESX, and Qbox. Some of our scripts are Standalone and will work on any framework. Check the tags on each product card to see its compatibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="faq-item border-white/10">
              <AccordionTrigger className="text-white hover:text-primary transition-colors text-lg font-bold">Do you offer support?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base leading-relaxed">
                Yes! We offer 24/7 support through our Discord server. Once you purchase a script, you&apos;ll receive a customer role that grants you access to our dedicated support channels.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="faq-item border-white/10">
              <AccordionTrigger className="text-white hover:text-primary transition-colors text-lg font-bold">Are updates free?</AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-base leading-relaxed">
                Absolutely. Once you purchase a script, you are entitled to all future updates and bug fixes for that specific resource at no additional cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">Ready to upgrade?</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Join thousands of other server owners who have already taken their server to the next level. Get support, updates, and exclusive releases.</p>
          <Button
            size="lg"
            className="cursor-target h-14 px-10 text-lg font-bold rounded-xl"
            onClick={() => window.open(DISCORD_URL, '_blank', 'noopener,noreferrer')}
          >
            Join our Discord <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
