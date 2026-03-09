"use client";

import { ConnectButton } from '@mysten/dapp-kit';
import { Briefcase, ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-navy-900 p-2 rounded-lg text-white">
            <Briefcase size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            Talent<span className="text-brandBlue-500">Protocol</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <ShieldAlert size={16} /> Admin
          </span>
          <ConnectButton className="!bg-brandBlue-500 hover:!bg-brandBlue-400 !transition-all !rounded-xl !shadow-lg" />
        </div>
      </div>
    </header>
  );
}