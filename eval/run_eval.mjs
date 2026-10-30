// Tutor eval koşusu: öğrenci mesajlarını yerelde çalışan uygulamanın kendi
// endpoint'ine gönderir. Böylece model, sistem talimatı ve ayarlar uygulamayla aynıdır.
//
// Kullanım (repo kökünden, sunucu açıkken: npm run dev):
//   node eval/run_eval.mjs
//
// Node 22.18+ .ts dosyalarını doğrudan içe aktarabilir (tip silme).

import { readFile, writeFile } from 'node:fs/promises';
import { DECISIONS, LEVELS } from '../src/data/story.ts';
import { MODEL } from '../src/data/tutorPrompt.ts';

const ENDPOINT = process.env.TUTOR_URL || 'http://localhost:3000/api/tutor/chat';
const BEKLEME_MS = 2000;
const MAKS_TEKRAR = 3; // FALLBACK satırlarını en fazla bu kadar tekrar dener

const evalDir = new URL('./', import.meta.url);
const ogrenciler = JSON.parse(await readFile(new URL('ogrenci_cevaplari.json', evalDir), 'utf8'));

const KARAR_ID = { K1: 1, K2: 2, K3: 3 };
const SEVIYELER = LEVELS.map((l) => l.title);

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// src/App.tsx'teki decisionText formülünün aynısı
function kararMetni(d) {
  return `${d.incidentHeading} — ${d.title}. Seçenek A: ${d.options.A.title} (${d.options.A.subtitle}). Seçenek B: ${d.options.B.title} (${d.options.B.subtitle}).`;
}

// src/components/TutorDrawer.tsx'teki istek gövdesinin aynısı (ilk açılıştaki sohbet)
function istekGovdesi(satir) {
  const decisionId = KARAR_ID[satir.karar];
  const d = DECISIONS[decisionId];
  if (!d) throw new Error(`id=${satir.id}: bilinmeyen karar ${satir.karar}`);
  if (!SEVIYELER.includes(satir.seviye)) throw new Error(`id=${satir.id}: bilinmeyen seviye ${satir.seviye}`);
  return {
    message: satir.mesaj,
    history: [{ role: 'model', text: d.tutorDefaultQuestion }],
    context: {
      decisionId,
      decisionText: kararMetni(d),
      teachingTarget: d.tutorTeachingTarget,
      userLevel: satir.seviye,
    },
  };
}

async function sor(satir) {
  const govde = istekGovdesi(satir);
  const baslangic = performance.now();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(govde),
  });
  if (!res.ok) throw new Error(`id=${satir.id}: HTTP ${res.status}`);
  const { reply, source } = await res.json();
  const sure_ms = Math.round(performance.now() - baslangic);
  if (source !== 'model' && source !== 'fallback') {
    throw new Error(`id=${satir.id}: yanıtta source alanı yok ya da tanımsız (${source})`);
  }
  const yanit = (reply ?? '').trim();
  // Sunucu hata olunca (veya anahtar yoksa) tutorDefaultQuestion ile source: 'fallback' döndürür.
  const fallback = source === 'fallback';
  return {
    id: satir.id,
    karar: satir.karar,
    seviye: satir.seviye,
    tur: satir.tur,
    mesaj: satir.mesaj,
    tutor_yanit: yanit,
    model: MODEL,
    tarih: new Date().toISOString(),
    durum: fallback ? 'FALLBACK' : 'OK',
    sure_ms,
  };
}

const sonuclar = new Map();
let ilkIstek = true;
async function sirayla(satirlar) {
  for (const satir of satirlar) {
    if (!ilkIstek) await bekle(BEKLEME_MS);
    ilkIstek = false;
    const s = await sor(satir);
    sonuclar.set(s.id, s);
    console.log(`#${s.id} ${s.karar} ${s.durum} ${s.sure_ms} ms: ${s.tutor_yanit.slice(0, 80)}`);
  }
}

console.log(`Model: ${MODEL} · Endpoint: ${ENDPOINT} · ${ogrenciler.length} mesaj`);
await sirayla(ogrenciler);

for (let tekrar = 1; tekrar <= MAKS_TEKRAR; tekrar++) {
  const kalan = ogrenciler.filter((s) => sonuclar.get(s.id).durum === 'FALLBACK');
  if (kalan.length === 0) break;
  if (kalan.length === ogrenciler.length && tekrar === 1) {
    console.error('Tüm yanıtlar FALLBACK: GEMINI_API_KEY .env dosyasında mı, sunucu yeniden başlatıldı mı?');
    break;
  }
  console.log(`\n${kalan.length} FALLBACK satırı tekrar deneniyor (${tekrar}/${MAKS_TEKRAR})…`);
  await bekle(BEKLEME_MS * 5);
  await sirayla(kalan);
}

const satirlar = ogrenciler.map((s) => sonuclar.get(s.id));
await writeFile(
  new URL('sonuclar_v1.jsonl', evalDir),
  satirlar.map((s) => JSON.stringify(s)).join('\n') + '\n',
  'utf8',
);

const csvAlan = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const basliklar = ['id', 'karar', 'tur', 'mesaj', 'tutor_yanit', 'ele_verdi_mi', 'hata_turu', 'not'];
const csv = [
  basliklar.join(','),
  ...satirlar.map((s) => [s.id, s.karar, s.tur, s.mesaj, s.tutor_yanit, '', '', ''].map(csvAlan).join(',')),
].join('\r\n');
await writeFile(new URL('etiketleme_v1.csv', evalDir), '﻿' + csv + '\r\n', 'utf8');

const fallbackSayisi = satirlar.filter((s) => s.durum === 'FALLBACK').length;
const ortalamaMs = Math.round(satirlar.reduce((t, s) => t + s.sure_ms, 0) / satirlar.length);
console.log(`\nYazıldı: eval/sonuclar_v1.jsonl, eval/etiketleme_v1.csv`);
console.log(`Model: ${MODEL} · OK: ${satirlar.length - fallbackSayisi} · FALLBACK: ${fallbackSayisi} · ortalama yanıt süresi: ${ortalamaMs} ms`);
if (fallbackSayisi > 0) {
  console.error(`UYARI: ${fallbackSayisi} satır FALLBACK. Eval'de FALLBACK kalmamalı; koşuyu tekrarla.`);
  process.exitCode = 1;
}
