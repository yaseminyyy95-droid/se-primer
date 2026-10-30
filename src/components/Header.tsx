/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Radio, Activity, ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  statusText?: string;
  latency?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  showBack = false,
  title = 'Canlı Kriz Simülasyonu',
  subtitle = 'SE Primer: Oynanan Bir Kitap',
  statusText = 'GÖREV AKTİF',
  latency = '42MS',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070B14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 pt-3 pb-2 text-slate-200">
      {/* Top micro status bar */}
      <div className="flex items-center justify-between text-[10px] tracking-wider font-mono text-slate-400 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-semibold">SYS.INIT // CORE_BOOT</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>TELEMETRY: STABLE</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={onBack}
              aria-label="Geri Dön"
              className="w-8 h-8 -ml-1 flex items-center justify-center rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-500/30">
              <span className="font-bold text-xs text-slate-950 font-mono tracking-tighter">SE</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 leading-tight font-serif tracking-tight">
                {title}
              </h1>
              <p className="text-[11px] text-slate-400 leading-none">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Sub status tab */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/50 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-amber-400 font-semibold relative pb-0.5">
          <span>{statusText}</span>
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-mono">
          <Activity className="w-3 h-3" />
          <span>LATENCY: {latency}</span>
        </div>
      </div>
    </header>
  );
};
