'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ChevronDown, LogIn } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '@/store/useCurrencyStore';
import { Button } from '@/components/ui/button';
import { Cart } from '@/components/store/Cart';
import { LoginModal } from '@/components/auth/LoginModal';
import ProfileDropdown from '@/components/kokonutui/profile-dropdown';
import logoBanner from '@/app/assets/logo-banner.png';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TEBEX_BASKET_STORAGE_KEY = 'tebex-basket-ident';
const OPEN_LOGIN_MODAL_EVENT = 'zs:open-login-modal';

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const { user, setUser, logout } = useUserStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const pathname = usePathname();

  useEffect(() => {
    const openLogin = () => setIsLoginOpen(true);
    window.addEventListener(OPEN_LOGIN_MODAL_EVENT, openLogin);

    return () => {
      window.removeEventListener(OPEN_LOGIN_MODAL_EVENT, openLogin);
    };
  }, []);

  useEffect(() => {
    if (!mounted || user) return;

    const basketIdent = window.localStorage.getItem(TEBEX_BASKET_STORAGE_KEY);
    if (!basketIdent) return;

    const syncUserFromBasket = async () => {
      try {
        const res = await fetch(`/api/tebex/user?basketIdent=${encodeURIComponent(basketIdent)}`, {
          cache: 'no-store',
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to sync Tebex user from basket:', error);
      }
    };

    syncUserFromBasket();
  }, [mounted, user, setUser]);

  const handleLogout = () => {
    window.localStorage.removeItem(TEBEX_BASKET_STORAGE_KEY);
    logout();
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'New Release', href: '/new-release', highlight: true },
    { name: 'Free', href: '/free' },
    { name: 'Bundles', href: '/bundles' },
    { name: 'Gift Cards', href: '/gift-cards' },
    { name: 'Docs', href: 'https://docs.zeroscripts.net', external: true },
    { name: 'Support', href: 'https://discord.gg/AYUjHcEU', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoBanner}
            alt="Zero Scripts"
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Center Navigation Pill */}
        <nav className="hidden lg:flex items-center rounded-2xl border border-white/10 bg-[#121212]/90 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_36px_-28px_rgba(255,42,42,0.6)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            if (link.external) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-xl px-4 py-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white after:absolute after:bottom-[2px] after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-200 after:content-[''] hover:after:w-[62%]"
                >
                  {link.name}
                </a>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  link.highlight 
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/15" 
                    : isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-white",
                  !link.highlight && "after:absolute after:bottom-[2px] after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-200 after:content-[''] hover:after:w-[62%]",
                  isActive && !link.highlight && "after:w-[62%]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:flex items-center space-x-1 text-sm font-medium text-white hover:text-zinc-300 transition-colors bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2.5 outline-none">
                <span>{currency}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/5 text-white">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <DropdownMenuItem 
                    key={code} 
                    onClick={() => setCurrency(code)}
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white"
                  >
                    {code} ({CURRENCIES[code].symbol})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button 
            variant="outline" 
            size="icon" 
            className="cursor-target relative bg-[#0f0f0f] border-white/5 hover:bg-white/10 hover:text-white rounded-xl h-[42px] w-[42px]" 
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {user ? (
            <ProfileDropdown
              name={user.username}
              email={user.email}
              onLogout={handleLogout}
            />
          ) : (
            <Button 
              className="cursor-target bg-primary text-white hover:bg-[#ff3d3d] hover:text-white hover:shadow-[0_0_30px_-7px_rgba(255,42,42,0.95)] rounded-xl px-6 py-5 font-semibold text-sm shadow-[0_10px_24px_-14px_rgba(255,42,42,0.95)]" 
              onClick={() => setIsLoginOpen(true)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
}
