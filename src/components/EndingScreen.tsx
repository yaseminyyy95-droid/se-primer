/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Award,
  Clock,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { calculateClock, DECISIONS } from '../data/story.ts';

interface DecisionChoice {
  decisionId: number;
  chosen: 'A' | 'B';
  timedOut: boolean;
}

interface EndingScreenProps {
  choices: Record<number, DecisionChoice>;
  onRestart: () => void;
  onOpenPostMortem: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  choices,
  onRestart,
  onOpenPostMortem,
}) => {
  // Spec §3: Sonu yalnızca Karar 3 belirler (A -> SON A · İYİ, B -> SON B · KÖTÜ)
  const k3Choice = choices[3]?.chosen || 'A';
  const isGoodEnding = k3Choice === 'A';

  // Calculate total minutes: K1 + K2 + K3
  const totalMinutes =
    (choices[1]?.chosen ? DECISIONS[1].options[choices[1].chosen].durationMinutes : 12) +
    (choices[2]?.chosen ? DECISIONS[2].options[choices[2].chosen].durationMinutes : 5) +
    (choices[3]?.chosen ? DECISIONS[3].options[choices[3].chosen].durationMinutes : 8);

  const finalClockTime = calculateClock(totalMinutes);

  // Successful decisions count (how many 'A' choices)
  const successfulCount = [1, 2, 3].filter((id) => choices[id]?.chosen === 'A').length;

  return (
    <div className="flex flex-col px-4 py-4 space-y-4 pb-12">
      {/* Session Archive Status Header */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isGoodEnding ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
            }`}
          />
          <span className="text-slate-300 font-bold">
            {isGoodEnding ? 'OTURUM ARŞİVLENDİ' : 'OTURUM ARŞİVLENDİ // KRİTİK İHLAL'}
          </span>
        </div>
        <span className="text-slate-400">V-2.4 // HASTANE-ACİL</span>
      </div>

      {/* Book Conclusion & Ending Badge */}
      <div className="space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90">
          SENARYO TAMAMLANDI: KİTAP KAPANIŞI
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {isGoodEnding ? (
            <span
              data-testid="ending-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/70 text-xs font-bold text-emerald-300 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SON A · İYİ SONUÇ
            </span>
          ) : (
            <span
              data-testid="ending-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/70 text-xs font-bold text-rose-300 shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              SON B · KÖTÜ SONUÇ
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-slate-400">
            {isGoodEnding
              ? 'Alternatif: SON B · KÖTÜ (Sistem Çöküşü)'
              : 'Alternatif: SON A · İYİ (Sistem Güvende)'}
          </span>
        </div>
      </div>

      {/* Main Ending Title & Ending Time */}
      <div className="space-y-1 pt-1">
        <h1
          data-testid="ending-title"
          className="text-2xl sm:text-3xl font-bold font-serif leading-tight text-white"
        >
          {isGoodEnding ? (
            <>
              Sistem{' '}
              <span data-testid="ending-time" className="text-amber-400 font-mono">
                {finalClockTime}
              </span>
              &apos;te ayakta,{' '}
              <span className="text-emerald-400 underline decoration-emerald-500/50">
                hasta verisi güvende.
              </span>
            </>
          ) : (
            <>
              Sistem{' '}
              <span data-testid="ending-time" className="text-amber-400 font-mono">
                {finalClockTime}
              </span>
              &apos;te ayakta ama{' '}
              <span className="text-rose-400 underline decoration-rose-500/50">
                KVKK ihlali var.
              </span>
            </>
          )}
        </h1>

        <p className="text-xs text-slate-300 font-serif leading-relaxed">
          {isGoodEnding
            ? 'Randevu sistemi normale döndü, loglar maskelenerek paylaşıldı.'
            : 'Loglar hasta adı ve T.C. kimlik numarasıyla birlikte tedarikçiye gönderildi.'}
        </p>
      </div>

      {/* Triage Graphic Banner Card */}
      <div
        className={`rounded-2xl p-4 border relative overflow-hidden shadow-lg ${
          isGoodEnding
            ? 'bg-gradient-to-r from-emerald-950/50 via-[#0e1f2b] to-slate-950 border-emerald-800/40'
            : 'bg-gradient-to-r from-rose-950/50 via-[#271018] to-slate-950 border-rose-800/40'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            {isGoodEnding ? (
              <HeartPulse className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span className={isGoodEnding ? 'text-emerald-300' : 'text-rose-300'}>
              {isGoodEnding
                ? 'CANLI TRİYAJ TABLOSU: 0 KAYIP'
                : 'CANLI TRİYAJ TABLOSU: VERİ SIZINTISI'}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
              isGoodEnding
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                : 'bg-rose-900/60 text-rose-300 border border-rose-700/60'
            }`}
          >
            {isGoodEnding ? 'STABİL' : 'KRİTİK'}
          </span>
        </div>

        {/* Decorative ECG waveform */}
        <div className="mt-3 h-8 flex items-center opacity-40">
          <svg className="w-full h-8" viewBox="0 0 300 40" fill="none">
            <path
              d={
                isGoodEnding
                  ? 'M0 20 L40 20 L45 10 L50 30 L55 5 L60 25 L65 20 L150 20 L155 12 L160 28 L165 20 L300 20'
                  : 'M0 20 L30 20 L35 5 L40 35 L45 0 L55 38 L65 20 L120 20 L130 5 L140 35 L150 20 L300 20'
              }
              stroke={isGoodEnding ? '#10b981' : '#f43f5e'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* SİSTEM VİTALS & TELEMETRİ ÖZETİ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold tracking-wider">
            SİSTEM VİTALS & TELEMETRİ ÖZETİ
          </span>
          <span className="text-cyan-400 text-[10px]">NOC-VERIFIED</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Uptime */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Uptime</span>
            <span
              className={`text-lg font-bold font-mono mt-1 ${
                isGoodEnding ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isGoodEnding ? '%99.4' : '%94.2'}
            </span>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isGoodEnding ? 'w-[99%] bg-emerald-500' : 'w-[94%] bg-amber-500'
                }`}
              />
            </div>
          </div>

          {/* Loss / Violation */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase truncate">
              {isGoodEnding ? 'Kayıt Kaybı' : 'Veri İhlali'}
            </span>
            <span
              className={`text-lg font-bold font-mono mt-1 ${
                isGoodEnding ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isGoodEnding ? '0' : '300'}
            </span>
            <span className="text-[9px] font-mono text-slate-400 truncate mt-1">
              {isGoodEnding ? 'SIFIR KAYIP' : '300 KAYIT SIZDI'}
            </span>
          </div>

          {/* MTTR */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">MTTR</span>
            <span className="text-lg font-bold font-mono mt-1 text-slate-100">
              {totalMinutes} dk
            </span>
            <span
              className={`text-[9px] font-mono mt-1 truncate ${
                totalMinutes <= 25 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalMinutes <= 25 ? 'HEDEF: <20DK' : 'HEDEF AŞILDI'}
            </span>
          </div>
        </div>
      </div>

      {/* SENARYO KARAR DEFTERİ (KRONOLOJİ) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold tracking-wider">
            SENARYO KARAR DEFTERİ (KRONOLOJİ)
          </span>
          <span
            className={`text-[10px] font-bold ${
              successfulCount === 3
                ? 'text-emerald-400'
                : successfulCount > 0
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {successfulCount} / 3 BAŞARILI
          </span>
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((decId) => {
            const dec = DECISIONS[decId];
            const choice = choices[decId];
            const chosenKey = choice?.chosen || 'A';
            const optData = dec.options[chosenKey];
            const isSuccess = chosenKey === 'A';

            return (
              <div
                key={decId}
                className="bg-[#0E1526] border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {dec.shortTag}
                    </span>
                    <span className="text-xs font-bold text-slate-200 font-serif">
                      {optData.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {optData.summarySentence}
                  </p>

                  {choice?.timedOut && (
                    <span className="text-[10px] font-mono text-rose-400 font-semibold block">
                      (Süre Dolduğu İçin B Uygulandı)
                    </span>
                  )}
                </div>

                <div className="flex-shrink-0 mt-0.5">
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality or Risk Evaluation Card */}
      <div
        className={`rounded-2xl p-4 border flex items-start gap-3 shadow-md ${
          isGoodEnding
            ? 'bg-[#101b2f] border-indigo-800/50'
            : 'bg-[#221017] border-rose-800/50'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isGoodEnding
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          {isGoodEnding ? (
            <Award className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        <div className="space-y-0.5">
          <p
            className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
              isGoodEnding ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {isGoodEnding ? 'KALİTE DEĞERLENDİRMESİ' : 'RİSK DEĞERLENDİRMESİ'}
          </p>
          <p className="text-sm font-bold font-serif text-slate-100">
            {isGoodEnding
              ? 'Soğukkanlı SRE & Güvenilirlik Mimarı'
              : 'KVKK İhlali & Canlıda Düzeltme Riski'}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {isGoodEnding
              ? 'Hata bütçesi korunarak, sağlık verileri tam güvence altında tamamlandı.'
              : 'Hukuki ve teknik yaptırım riski oluştu; hassas hasta verileri dışarı aktarıldı.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2.5">
        <button
          type="button"
          data-testid="restart-btn"
          onClick={onRestart}
          className="w-full min-h-[50px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.99]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Yeniden Oyna (Farklı Yolları Keşfet)</span>
        </button>

        <button
          type="button"
          onClick={onOpenPostMortem}
          className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Post-Mortem Raporunu İncele</span>
        </button>
      </div>
    </div>
  );
};
