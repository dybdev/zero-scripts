"use client";

import * as React from 'react';
import { BookOpen, ChevronDown, LifeBuoy, LogOut, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileDropdownProps {
  name: string;
  email?: string;
  className?: string;
  docsUrl?: string;
  supportUrl?: string;
  onLogout: () => void;
}

export default function ProfileDropdown({
  name,
  email,
  onLogout,
  docsUrl = 'https://docs.zeroscripts.net',
  supportUrl = 'https://discord.gg/AYUjHcEU',
  className,
}: ProfileDropdownProps) {
  const initial = (name?.trim()?.charAt(0) || 'U').toUpperCase();

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-[#101010]/95 px-3 py-2 text-left text-white transition-all hover:border-primary/35 hover:bg-[#151515]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-xs font-bold text-primary">
            {initial}
          </div>
          <div className="hidden sm:block">
            <p className="max-w-[140px] truncate text-sm font-semibold leading-tight">{name}</p>
            <p className="max-w-[140px] truncate text-xs text-zinc-400 leading-tight">
              {email || 'Connected via Tebex'}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-56 border-white/10 bg-[#0f0f0f] text-white"
        >
          <div className="px-2 py-1.5 text-xs text-zinc-300">
            Signed in as <span className="font-semibold text-white">{name}</span>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(docsUrl, '_blank', 'noopener,noreferrer')}>
            <BookOpen className="h-4 w-4" />
            Documentation
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(supportUrl, '_blank', 'noopener,noreferrer')}>
            <LifeBuoy className="h-4 w-4" />
            Support
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" onClick={() => window.open('/products', '_self')}>
            <UserCircle2 className="h-4 w-4" />
            My Account
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
