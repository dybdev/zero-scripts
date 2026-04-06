import Link from 'next/link';
import Image from 'next/image';
import logoBanner from '@/app/assets/logo-banner.png';

export function Footer() {
  const footerLinkClass = "relative inline-block text-zinc-400 transition-colors hover:text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100";

  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-6 inline-flex items-center">
              <Image
                src={logoBanner}
                alt="Zero Scripts"
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              Premium, highly optimized, and fully configurable resources for your FiveM server. Elevate your roleplay experience today with our cutting-edge scripts.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><Link href="/products" className={footerLinkClass}>All Products</Link></li>
              <li><Link href="/new-release" className={footerLinkClass}>New Releases</Link></li>
              <li><Link href="/free" className={footerLinkClass}>Free Scripts</Link></li>
              <li><Link href="/bundles" className={footerLinkClass}>Bundles</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support & Legal</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><a href="https://docs.zeroscripts.net" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Documentation</a></li>
              <li><a href="https://discord.gg/AYUjHcEU" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Discord Server</a></li>
              <li><Link href="/terms" className={footerLinkClass}>Terms of Service</Link></li>
              <li><Link href="/privacy" className={footerLinkClass}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-sm text-zinc-500">
          <p>
            Copyright © 2026 Zero Scripts. Not affiliated with or endorsed by Rockstar North, Take-Two Interactive or other rights holders. FiveM is a copyright and registered trademark of Take-Two Interactive Software, Inc.
          </p>
          <p className="mt-2">
            Our checkout process is owned &amp; operated by Tebex Limited, who handle product fulfilment, billing support and refunds.
          </p>
          <p className="mt-2 text-zinc-400">
            Powered by Tebex.
          </p>
        </div>
      </div>
    </footer>
  );
}
