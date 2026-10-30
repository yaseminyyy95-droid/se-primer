/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Volume2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Zap,
  Info,
  Bot,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  DecisionData,
  LevelId,
  RoleId,
  GoalId,
  ROLES,
  CRISIS_BASE_TEXT,
} from '../data/story.ts';

interface DecisionSceneProps {
  decision: DecisionData;
  level: LevelId;
  role: RoleId;
  goal: GoalId;
  currentTimeString: string;
  selectedOption: 'A' | 'B' | null;
  timedOut: boolean;
  onSelectOption: (option: 'A' | 'B', isTimeout?: boolean) => void;
  onContinue: () => void;
  onOpenTutor: () => void;
}

export const DecisionScene: React.FC<DecisionSceneProps> = ({
  decision,
  level,
  role,
  goal,
  currentTimeString,
  selectedOption,
  timedOut,
  onSelectOption,
  onContinue,
  onOpenTutor,
}) => {
  // 60-second countdown timer for "Deneyimliyim" (level === 2)
  const isExperienced = level === 2;
  const isBeginner = level === 0;
  const isIntermediate = level === 1; // "Biraz deneyimim var"
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [showHint, setShowHint] = useState(isBeginner);

  // Keep hint open if beginner, closed initially if intermediate
  useEffect(() => {
    if (isBeginner) {
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  }, [isBeginner, decision.id]);

  // Reset timer on decision change
  useEffect(() => {
    if (isExperienced && !selectedOption) {
      setSecondsLeft(60);
    }
  }, [decision.id, isExperienced, selectedOption]);

  // Timer interval for experienced players
  useEffect(() => {
    if (!isExperienced || selectedOption) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Automatically pick B due to timeout as per spec §4
          onSelectOption('B', true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExperienced, selectedOption, onSelectOption]);

  const rolePrefix = ROLES.find((r) => r.id === role)?.incidentPrefix || '';
  const chosenData = selectedOption ? decision.options[selectedOption] : null;

  return (
    <div className="flex flex-col px-4 py-3 space-y-4 pb-12">
      {/* Status Badges Row (Clock, Chapter, Timer) */}
      <div className="flex items-center justify-between gap-1.5 text-xs font-mono">
        {/* Current Time Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-bold shadow-sm">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentTimeString}</span>
        </div>

        {/* Chapter / Stage Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-200 font-semibold text-[11px] truncate">
          <Volume2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="truncate">{decision.stageLabel}</span>
        </div>

        {/* Timer Countdown (for experienced players) */}
        {isExperienced && !selectedOption && (
          <div
            data-testid="timer"
            className={`flex items-center justify-center w-9 h-9 rounded-full border-2 font-mono font-bold text-xs transition-colors ${
              secondsLeft <= 15
                ? 'border-red-500 bg-red-950/80 text-red-300 animate-pulse'
                : 'border-amber-500 bg-amber-950/60 text-amber-300'
            }`}
          >
            {secondsLeft}s
          </div>
        )}
      </div>

      {/* Incident Box */}
      <div className="relative rounded-2xl border border-slate-800 bg-[#0E1526] p-4 shadow-xl space-y-3">
        {/* Severity & Ref Tags */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-600/60 text-rose-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {decision.triageSeverity}
          </span>
          <span className="text-slate-400 font-mono tracking-wider text-[10px]">
            {decision.triageRef}
          </span>
        </div>

        {/* Incident Titles */}
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-tight leading-snug">
            {decision.incidentHeading}
          </h2>
          <p className="text-xs text-amber-400/90 italic font-serif mt-0.5">
            Saha Mühendisi Kayıt Defteri — Sayfa {decision.id * 14}
          </p>
        </div>

        {/* Framed Narrative Text: Only on Karar 1 */}
        {decision.id === 1 && (
          <div
            data-testid="crisis-text"
            className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-xl border border-slate-800/80"
          >
            <p>
              <span className="text-amber-300 font-medium font-serif">{rolePrefix}</span>
              {CRISIS_BASE_TEXT}
            </p>
          </div>
        )}

        {/* Triage Stats Cards */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#151F38] border border-slate-700/70 rounded-xl p-2.5">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">BEKLEYEN HASTA</p>
            <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">{decision.triageWaitCount}</p>
          </div>
          <div className="bg-[#151F38] border border-slate-700/70 rounded-xl p-2.5">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">HATA KODU</p>
            <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">{decision.triageError}</p>
          </div>
        </div>
      </div>

      {/* Hint Toggle Button for "Biraz deneyimim var" (level === 1) */}
      {isIntermediate && (
        <div className="flex justify-end">
          <button
            type="button"
            data-testid="hint-toggle"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-amber-300 text-xs font-semibold transition-colors shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'İpucunu gizle' : 'İpucu göster'}</span>
          </button>
        </div>
      )}

      {/* Hint Box (Always visible for Beginner, toggleable for Intermediate) */}
      {(showHint || isBeginner) && (
        <div
          data-testid="hint-box"
          className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-[#181a28] to-amber-950/20 p-3.5 flex items-start gap-3 shadow-md animate-in fade-in duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-950 shadow-sm shadow-amber-500/50">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <span>İpucu</span>
              <span className="text-[10px] text-amber-400/70 font-normal">
                ({level === 0 ? 'Yeni Başlayan Rehberi' : 'Saha Mühendisi İpucu Notu'})
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-serif">
              {decision.hint}
            </p>
          </div>
        </div>
      )}

      {/* Action Protocol Heading */}
      <div className="flex items-center justify-between text-xs font-mono pt-1">
        <span className="text-slate-300 font-bold uppercase tracking-wider">
          ACİL MÜDAHALE PROTOKOLÜ
        </span>
        <span className="text-cyan-400 text-[11px] font-medium">
          {selectedOption ? 'KARAR VERİLDİ' : 'SEÇİM YAPINIZ'}
        </span>
      </div>

      {/* Option Cards A & B */}
      <div className="space-y-2.5">
        {(['A', 'B'] as const).map((optKey) => {
          const opt = decision.options[optKey];
          const isSelected = selectedOption === optKey;
          const isDisabled = !!selectedOption;

          return (
            <button
              key={optKey}
              type="button"
              data-testid={`choice-${optKey}`}
              disabled={isDisabled}
              onClick={() => onSelectOption(optKey, false)}
              className={`w-full min-h-[72px] text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'bg-[#152342] border-amber-500 shadow-lg shadow-amber-500/15'
                  : selectedOption
                  ? 'bg-[#0E1526]/50 border-slate-800/60 opacity-60'
                  : 'bg-[#0E1526] border-slate-800 hover:border-slate-700 hover:bg-[#121B32] active:scale-[0.99]'
              }`}
            >
              <div className="space-y-1.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-mono text-amber-400">[{optKey}]</span>
                  <span className="text-sm font-bold text-slate-100 font-serif">
                    {opt.title}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-snug font-sans">
                  {opt.subtitle}
                </p>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border transition-colors ${
                  isSelected ? 'border-amber-400 bg-amber-500 text-slate-950' : 'border-slate-600 bg-slate-800/40'
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Outcome / Evaluation Card (Shows after decision or timeout) */}
      {selectedOption && chosenData && (
        <div
          data-testid="outcome-card"
          className="rounded-2xl border border-emerald-500/40 bg-[#0c1929] p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          {/* Assessment Header with Risk and Duration badges shown ONLY AFTER selection */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-emerald-500 tracking-wider">
                  KARAR DEĞERLENDİRMESİ
                </span>
                <span className="text-sm font-serif text-emerald-300">
                  {timedOut ? 'Süre Doldu · B Seçeneği Uygulandı' : chosenData.assessmentTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span
                className={`px-2 py-0.5 rounded font-semibold border ${
                  chosenData.riskBadge.color === 'green'
                    ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-400'
                    : chosenData.riskBadge.color === 'amber'
                    ? 'bg-amber-950/70 border-amber-600/60 text-amber-400'
                    : 'bg-rose-950/70 border-rose-600/60 text-rose-400'
                }`}
              >
                {chosenData.riskBadge.text}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                +{chosenData.durationMinutes} dk
              </span>
            </div>
          </div>

          {/* Ne Oldu? */}
          <div className="bg-[#112338] border border-emerald-900/50 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ne oldu?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {chosenData.whatHappened}
            </p>
          </div>

          {/* Neden Oldu? */}
          <div className="bg-[#112338] border border-emerald-900/50 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              <span>Neden oldu?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {chosenData.whyHappened}
            </p>
          </div>

          {/* Hedef (Goal) insight row from spec §4 */}
          <div className="border-t border-emerald-900/60 pt-2 flex items-start gap-2 text-xs text-cyan-200/90 font-mono">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {decision.goalInsights[goal]}
            </p>
          </div>
        </div>
      )}

      {/* Tutor Section / Teaser Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0E1526] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 font-mono">
              Tutor (Kıdemli Sistem Mimarı)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ÇEVRİMİÇİ
          </span>
        </div>

        {/* Tutor Socratic Question Quote Bubble */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs italic text-slate-300 font-serif leading-relaxed">
          &ldquo;{decision.tutorDefaultQuestion}&rdquo;
        </div>

        {/* Tutor Open Button */}
        <button
          type="button"
          data-testid="tutor-open"
          onClick={onOpenTutor}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Tutor&apos;a Sor (AI Kıdemli Mühendis)</span>
        </button>
      </div>

      {/* Continue CTA Button (shown after a decision is made) */}
      {selectedOption && (
        <div className="pt-2">
          <button
            type="button"
            data-testid="continue-btn"
            onClick={onContinue}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.99] animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <span>
              {decision.id === 3
                ? 'Post-Mortem & Sonuç Raporu'
                : `Devam Et (Karar ${decision.id + 1}'e Geç)`}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
