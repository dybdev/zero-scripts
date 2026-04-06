import type {Metadata} from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { cn } from "@/lib/utils";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import TargetCursor from '@/components/TargetCursor';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zero Scripts',
  description: 'Premium FiveM Scripts',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={cn('font-sans dark', poppins.variable)}>
      <body className="min-h-screen bg-[#050505] text-white font-sans antialiased flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster theme="dark" />
        <TargetCursor targetSelector=".cursor-target" spinDuration={2.2} hoverDuration={0.16} />
      </body>
    </html>
  );
}
