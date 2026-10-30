/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Activity,
  Server,
  CheckCircle2,
  GitBranch,
  GraduationCap,
  Briefcase,
  Rocket,
  ArrowRight,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { LevelId, RoleId, GoalId, LEVELS, ROLES, GOALS } from '../data/story.ts';

interface IntroScreenProps {
  level: LevelId | null;
  role: RoleId | null;
  goal: GoalId | null;
  onSelectLevel: (lvl: LevelId) => void;
  onSelectRole: (role: RoleId) => void;
  onSelectGoal: (goal: GoalId) => void;
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  level,
  role,
  goal,
  onSelectLevel,
  onSelectRole,
  onSelectGoal,
  onStart,
}) => {
  // Calculate completion percentage: 0%, 33%, 66%, or 100%
  const answeredCount = (level !== null ? 1 : 0) + (role !== null ? 1 : 0) + (goal !== null ? 1 : 0);
  const percentage = Math.round((answeredCount / 3) * 100);
  const isAllAnswered = level !== null && role !== null && goal !== null;

  return (
    <div className="flex flex-col px-4 py-4 space-y-5 pb-12">
      {/* Monograph Category Tag */}
      <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase font-mono">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span>İNTERAKTİF MONOGRAF</span>
      </div>

      {/* Main Title */}
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-serif leading-snug">
          SE Primer: Yazılım Mühendisliği,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 italic font-serif">
            Oynanan Bir Kitap
          </span>
        </h1>
      </div>

      {/* Epigraph Quote Card */}
      <div className="relative border-l-2 border-amber-500 bg-[#0E1526]/80 p-3.5 rounded-r-xl border border-slate-800/80 shadow-md">
        <p className="text-sm italic text-slate-300 font-serif leading-relaxed">
          &ldquo;Her seçim bir durum geçişi. Her son bir kabul kriteri.&rdquo;
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
          <span className="tracking-wider">FOLIO REF. §01-PROLOGUE</span>
          <Activity className="w-3.5 h-3.5 text-amber-400/80" />
        </div>
      </div>

      {/* Monograph Cover Banner Card */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-[#11192d] to-[#0a101d] p-4 shadow-lg">
        {/* Subtle decorative circuit background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-amber-300">
              <Cpu className="w-3 h-3 text-amber-400" />
              MİMARİ ÇERÇEVE v2.4
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-200 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              MOD: AKADEMİK SERİ
            </span>
          </div>

          <div className="mt-auto">
            <p className="text-xs font-mono text-slate-400">HASTANE RANDEVU SİSTEMİ ALTYAPISI</p>
            <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Canlı Nöbet Simülasyon Senaryosu
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono font-semibold">
          <span className="text-amber-400 uppercase tracking-wide">
            AŞAMA {answeredCount}/3 · PROFİL TANIMLAMA
          </span>
          <span className="text-slate-300">%{percentage} HAZIR</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${level !== undefined ? 'bg-amber-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${role !== undefined ? 'bg-amber-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${goal !== undefined ? 'bg-amber-500' : 'bg-slate-800'}`} />
        </div>
      </div>

      {/* Question 1: Level */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">01</span>
            <span className="text-slate-200 font-bold text-sm">Seviyen?</span>
          </div>
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">DENEYİM DÜZEYİ</span>
        </div>

        <div className="space-y-2">
          {LEVELS.map((lvl) => {
            const isSelected = level === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                data-testid={`profile-level-${lvl.id}`}
                onClick={() => onSelectLevel(lvl.id)}
                className={`w-full min-h-[56px] text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#151f38] border-amber-500/80 shadow-md shadow-amber-500/10'
                    : 'bg-[#0E1526]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#121a30]'
                }`}
              >
                <div className="pr-2">
                  <div className={`text-sm font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-100'}`}>
                    {lvl.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {lvl.description}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-colors ${
                    isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Role */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">02</span>
            <span className="text-slate-200 font-bold text-sm">Rolün?</span>
          </div>
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">UZMANLIK ALANI</span>
        </div>

        <div className="space-y-2">
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            const Icon = r.id === 0 ? Server : r.id === 1 ? CheckCircle2 : GitBranch;
            return (
              <button
                key={r.id}
                type="button"
                data-testid={`profile-role-${r.id}`}
                onClick={() => onSelectRole(r.id)}
                className={`w-full min-h-[56px] text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#151f38] border-amber-500/80 shadow-md shadow-amber-500/10'
                    : 'bg-[#0E1526]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#121a30]'
                }`}
              >
                <div className="flex items-center gap-3 pr-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-100'}`}>
                      {r.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {r.description}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-colors ${
                    isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: Goal */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">03</span>
            <span className="text-slate-200 font-bold text-sm">Hedefin?</span>
          </div>
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">AMAÇ ODAĞI</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            const Icon = g.id === 0 ? GraduationCap : g.id === 1 ? Briefcase : Rocket;
            return (
              <button
                key={g.id}
                type="button"
                data-testid={`profile-goal-${g.id}`}
                onClick={() => onSelectGoal(g.id)}
                className={`min-h-[82px] p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-[#151f38] border-amber-500/90 shadow-md shadow-amber-500/10'
                    : 'bg-[#0E1526]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#121a30]'
                }`}
              >
                {/* Accent notification dot for active or interview card */}
                {g.id === 1 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
                <Icon
                  className={`w-5 h-5 mb-1.5 ${
                    isSelected ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isSelected ? 'text-amber-300' : 'text-slate-200'
                  }`}
                >
                  {g.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="pt-4 space-y-2">
        <button
          type="button"
          data-testid="start-btn"
          disabled={!isAllAnswered}
          onClick={onStart}
          className={`w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all transform ${
            isAllAnswered
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-orange-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Simülasyona Başla & Devam Et</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-[10px] text-center font-mono text-slate-400 tracking-wider">
          {isAllAnswered
            ? 'SENARYO HAZIRLANIYOR • OTOMATİK KAYIT AKTİF'
            : 'LÜTFEN BAŞLAMAK İÇİN TÜM SORULARI YANITLAYIN'}
        </p>
      </div>
    </div>
  );
};
