/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Server, BookOpen } from 'lucide-react';
import { DECISIONS, calculateClock } from '../data/story.ts';

interface DecisionChoice {
  decisionId: number;
  chosen: 'A' | 'B';
  timedOut: boolean;
}

interface PostMortemModalProps {
  isOpen: boolean;
  onClose: () => void;
  choices: Record<number, DecisionChoice>;
}

export const PostMortemModal: React.FC<PostMortemModalProps> = ({
  isOpen,
  onClose,
  choices,
}) => {
  if (!isOpen) return null;

  const k3Choice = choices[3]?.chosen || 'A';
  const isGoodEnding = k3Choice === 'A';
  const totalMinutes =
    (choices[1]?.chosen ? DECISIONS[1].options[choices[1].chosen].durationMinutes : 12) +
    (choices[2]?.chosen ? DECISIONS[2].options[choices[2].chosen].durationMinutes : 5) +
    (choices[3]?.chosen ? DECISIONS[3].options[choices[3].chosen].durationMinutes : 8);

  const finalClockTime = calculateClock(totalMinutes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[400px] bg-[#0E1526] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              Olay İnceleme (Post-Mortem) Raporu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block">OLAY KODU:</span>
              <span className="text-amber-400 font-bold">INC-2026-MED500</span>
            </div>
            <div>
              <span className="text-slate-400 block">SİSTEM AYAĞA KALKIŞ:</span>
              <span className="text-emerald-400 font-bold">{finalClockTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block">TOPLAM KESİNTİ (MTTR):</span>
              <span className="text-slate-200 font-bold">{totalMinutes} Dakika</span>
            </div>
            <div>
              <span className="text-slate-400 block">KVKK DURUMU:</span>
              <span className={isGoodEnding ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isGoodEnding ? 'İHLAL YOK' : 'İHLAL TESPİT EDİLDİ'}
              </span>
            </div>
          </div>

          {/* Section: Yönetici Özeti */}
          <div className="space-y-1">
            <h3 className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              1. Yönetici Özeti
            </h3>
            <p>
              Saat 08:00&apos;de v2.4 sürümü sonrası çöken hastane randevu sistemine nöbetçi mühendis tarafından acil müdahale gerçekleştirildi. Sistem {finalClockTime} itibarıyla stabil duruma getirildi.
              {isGoodEnding
                ? ' Loglar maskelenerek aktarıldığından hasta gizliliği tam olarak korunmuştur.'
                : ' Dış ekibe iletilen loglarda hasta isim ve T.C. kimlik numaraları maskelenmediği için KVKK ihlali raporlanmıştır.'}
            </p>
          </div>

          {/* Section: Karar Analizleri */}
          <div className="space-y-2">
            <h3 className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              2. Kararlar ve Teknik Çıkarımlar
            </h3>

            {/* K1 */}
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="font-mono text-amber-400 font-bold block text-[10px]">
                KARAR 1: MİMARİ MÜDAHALE
              </span>
              <p className="text-slate-200 font-serif">
                {choices[1]?.chosen === 'A'
                  ? 'Geri dönüş (Rollback) başarıyla uygulandı. Şema değişikliği olmadığı için veri kaybı yaşanmadan 12 dakikada bilinen-iyi duruma dönüldü.'
                  : 'Canlıda kök nedeni bilinmeden yama uygulandı. 3 deneme sonucunda 40 dakikalık ciddi bir ek kesinti süresi oluştu.'}
              </p>
            </div>

            {/* K2 */}
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="font-mono text-amber-400 font-bold block text-[10px]">
                KARAR 2: TEST & DOĞRULAMA
              </span>
              <p className="text-slate-200 font-serif">
                {choices[2]?.chosen === 'A'
                  ? '5 dakikalık duman testi (smoke test) kritik akışları doğruladı, regresyon hatası önlendi.'
                  : 'Test adımı atlanarak doğrudan yayına alındı. Randevu iptal akışındaki regresyon hatası ikinci bir düzeltme zorunluluğu doğurdu.'}
              </p>
            </div>

            {/* K3 */}
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="font-mono text-amber-400 font-bold block text-[10px]">
                KARAR 3: VERİ GÜVENLİĞİ & KVKK
              </span>
              <p className="text-slate-200 font-serif">
                {choices[3]?.chosen === 'A'
                  ? 'KVKK md. 6 ve Veri Minimizasyonu ilkesi gözetilerek loglar maskelendi, tedarikçi teknik hatayı güvenle çözdü.'
                  : 'Özel nitelikli hasta verileri tedarikçiye ham şekilde aktarıldı. KVKK denetimi gerektiren hukuki risk doğdu.'}
              </p>
            </div>
          </div>

          {/* Section: Önleyici Tedbirler */}
          <div className="space-y-1">
            <h3 className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              3. Önleyici Eylemler (Action Items)
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>Otomatik CI/CD pipeline&apos;ına canary deployment ve otomatik rollback eşiği eklenmeli.</li>
              <li>Staging ortamında kritik randevu akışları için zorunlu otomatik smoke test pipeline adımı oluşturulmalı.</li>
              <li>Loglayıcı kütüphaneye PII regex maskeleme modülü (hasta adı, T.C. kimlik) entegre edilmeli.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Raporu Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
