/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LevelId = 0 | 1 | 2; // 0: Yeni başladım, 1: Biraz deneyimim var, 2: Deneyimliyim
export type RoleId = 0 | 1 | 2;  // 0: Backend geliştirici, 1: Test (QA) mühendisi, 2: DevOps mühendisi
export type GoalId = 0 | 1 | 2;  // 0: Temelleri öğrenmek, 1: Mülakata hazırlanmak, 2: İşte uygulamak

export interface OptionData {
  id: 'A' | 'B';
  title: string;
  subtitle: string;
  riskBadge: { text: string; color: 'green' | 'amber' | 'red' };
  etaBadge: string;
  durationMinutes: number;
  whatHappened: string;
  whyHappened: string;
  assessmentTitle: string;
  summarySentence: string;
}

export interface DecisionData {
  id: number; // 1, 2, 3
  stepName: string; // "K1", "K2", "K3"
  stageLabel: string; // "BÖLÜM 1 · KARAR 1: MİMARİ"
  shortTag: string; // "01 // MİMARİ"
  title: string; // "Mimari — Sistemi nasıl ayağa kaldırırsın?"
  incidentHeading: string;
  triageSeverity: string;
  triageRef: string;
  triageWaitCount: string;
  triageError: string;
  hint: string;
  tutorTeachingTarget: string;
  tutorDefaultQuestion: string;
  options: {
    A: OptionData;
    B: OptionData;
  };
  goalInsights: {
    [key in GoalId]: string;
  };
}

export const LEVELS = [
  {
    id: 0 as LevelId,
    title: 'Yeni başladım',
    description: 'Sıfırdan mimari temeller ve temel kavramlar',
  },
  {
    id: 1 as LevelId,
    title: 'Biraz deneyimim var',
    description: 'Kod yazıyorum; ölçeklenebilirlik ve desenler arıyorum',
  },
  {
    id: 2 as LevelId,
    title: 'Deneyimliyim',
    description: 'Karmaşık dağıtık sistemler ve kriz yönetimi senaryoları',
  },
];

export const ROLES = [
  {
    id: 0 as RoleId,
    title: 'Backend geliştirici',
    description: 'API, SQL, Veri Modelleri, Mikroservisler',
    incidentPrefix: 'Hata logları senin servisini gösteriyor… ',
  },
  {
    id: 1 as RoleId,
    title: 'Test (QA) mühendisi',
    description: 'Regresyon, Otomasyon, Stres Testleri',
    incidentPrefix: 'Dün geceki sürümü sen onaylamıştın… ',
  },
  {
    id: 2 as RoleId,
    title: 'DevOps mühendisi',
    description: 'CI/CD, Kubernetes, Gözlemlenebilirlik',
    incidentPrefix: 'Alarm telefonunda çaldı… ',
  },
];

export const GOALS = [
  {
    id: 0 as GoalId,
    title: 'Temelleri öğrenmek',
    category: 'AMAÇ ODAĞI',
  },
  {
    id: 1 as GoalId,
    title: 'Mülakata hazırlanmak',
    category: 'AMAÇ ODAĞI',
  },
  {
    id: 2 as GoalId,
    title: 'İşte uygulamak',
    category: 'AMAÇ ODAĞI',
  },
];

export const BASE_START_TIME = '08:00';

export function calculateClock(additionalMinutes: number): string {
  const baseTotalMinutes = 8 * 60;
  const currentTotal = baseTotalMinutes + additionalMinutes;
  const hours = Math.floor(currentTotal / 60);
  const minutes = currentTotal % 60;
  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
}

export const CRISIS_BASE_TEXT =
  'Dün gece 23:40\'ta hastane randevu sisteminin v2.4 sürümü yayına alındı. Saat 08:00. Online randevu sayfası "500 – Sunucu Hatası" veriyor. 300 hasta bekliyor. Nöbetçi sensin.';

export const DECISIONS: Record<number, DecisionData> = {
  1: {
    id: 1,
    stepName: 'K1',
    stageLabel: 'BÖLÜM 1 · KARAR 1: MİMARİ',
    shortTag: '01 // MİMARİ',
    title: 'Sistemi nasıl ayağa kaldırırsın?',
    incidentHeading: 'Vaka: Randevu Sistemi Çöktü',
    triageSeverity: 'PROD INCIDENT · SEV-1',
    triageRef: 'REF: TRIAGE-ERR-504',
    triageWaitCount: '300 Hasta',
    triageError: '500 – Sunucu Hatası',
    hint: 'Hangi seçenek bilinen-iyi bir duruma döner, hangisi belirsizliği artırır?',
    tutorTeachingTarget: 'rollback ile hotfix arasındaki fark; geri dönmeden önce şema/migration kontrolü.',
    tutorDefaultQuestion: 'Geri dönmeden önce veritabanı şemasının değişip değişmediğini nasıl anlarsın?',
    options: {
      A: {
        id: 'A',
        title: 'Eski sürüme (v2.3) geri dön',
        subtitle: 'v2.3\'e geri dön — bilinen-iyi sürüme dönüş',
        riskBadge: { text: 'RİSK: DÜŞÜK', color: 'green' },
        etaBadge: 'ETA: 12 DK',
        durationMinutes: 12,
        whatHappened: '08:12\'de v2.3 ayakta, randevular açıldı.',
        whyHappened: 'Geri dönüş (rollback) bilinen-iyi bir duruma dönmektir. v2.4 veritabanı şemasını değiştirmediği için geri dönüş veri kaybı riski taşımadı.',
        assessmentTitle: 'Geri Dönüş (Rollback) Yapıldı',
        summarySentence: 'Bilinen-iyi duruma dönerek 300 hastanın bekleyişini bitirdin.',
      },
      B: {
        id: 'B',
        title: 'Canlıda yama yap',
        subtitle: 'Kök nedeni bilmeden canlıda düzeltme',
        riskBadge: { text: 'RİSK: YÜKSEK', color: 'red' },
        etaBadge: 'ETA: 40 DK',
        durationMinutes: 40,
        whatHappened: 'Yama ancak 3. denemede tuttu. 40 dakika boyunca randevu alınamadı.',
        whyHappened: 'Kök nedeni bilmeden canlı sistemde değişiklik yapmak belirsizliği artırır. Her deneme yeni bir risktir.',
        assessmentTitle: 'Canlıda Yama (Hotfix) Denendi',
        summarySentence: 'Yama 3. denemede tuttu, 40 dakika kesinti oluştu.',
      },
    },
    goalInsights: {
      0: 'Kavram: Rollback (geri dönüş), dağıtım başarısız olduğunda sistemi önceden doğrulanmış kararlı duruma alma işlemidir.',
      1: 'Mülakatta böyle anlat: "Kök nedeni bilinmeyen bir canlı çökmesinde öncelik MTTR\'ı düşürmek için rollback yapmaktır; şema göçü yoksa en güvenli yoldur."',
      2: 'Kontrol listene ekle: Canlı yayından önce her zaman rollback planı ve migration geri alma (down-migration) adımlarını hazırla.',
    },
  },
  2: {
    id: 2,
    stepName: 'K2',
    stageLabel: 'BÖLÜM 2 · KARAR 2: TEST',
    shortTag: '02 // TEST',
    title: 'Düzeltmeyi yayına almadan önce?',
    incidentHeading: 'Vaka: Doğrulama ve Güvenlik Eşiği',
    triageSeverity: 'PRE-DEPLOY · GATEWAY',
    triageRef: 'REF: VERIFY-STAGE-QA',
    triageWaitCount: 'Bekleyen Kuyruk',
    triageError: 'Regresyon Tehlikesi',
    hint: 'Kazanacağın birkaç dakikayı, olası bir yeni hatanın maliyetiyle karşılaştır.',
    tutorTeachingTarget: 'regresyon riski, smoke test\'in maliyeti ve faydası.',
    tutorDefaultQuestion: 'Bir düzeltmenin yeni bir hata getirmediğinden nasıl emin olabilirsin?',
    options: {
      A: {
        id: 'A',
        title: 'Önce kısa test koş',
        subtitle: 'Kritik randevu akışlarını 5 dakikalık smoke test ile doğrula',
        riskBadge: { text: 'RİSK: DÜŞÜK', color: 'green' },
        etaBadge: 'ETA: 5 DK',
        durationMinutes: 5,
        whatHappened: '5 dakikalık smoke test randevu oluşturma ve iptal akışlarını doğruladı. Yayın sorunsuz.',
        whyHappened: 'Kısa bir duman testi, düzeltmenin yeni bir hata (regresyon) getirmediğini kanıtlar.',
        assessmentTitle: 'Smoke Test Koşuldu & Doğrulandı',
        summarySentence: 'Smoke test, düzeltmenin yeni hata getirmediğini kanıtladı.',
      },
      B: {
        id: 'B',
        title: 'Hemen yayına al',
        subtitle: 'Test adımlarını atlayarak doğrudan canlıya sür',
        riskBadge: { text: 'RİSK: YÜKSEK', color: 'red' },
        etaBadge: 'ETA: 15 DK',
        durationMinutes: 15,
        whatHappened: '10 dk sonra "randevu iptal" butonunun çalışmadığı fark edildi, ikinci düzeltme gerekti.',
        whyHappened: 'Test edilmemiş değişiklik regresyon riskidir. Kazanılan 5 dakika, 15 dakika olarak geri ödendi.',
        assessmentTitle: 'Test Edilmeden Yayına Alındı',
        summarySentence: 'İptal butonu bozuldu, ikinci düzeltme gerekti.',
      },
    },
    goalInsights: {
      0: 'Kavram: Smoke test (duman testi), uygulamanın en kritik temel fonksiyonlarının çalışıp çalışmadığını ölçen hızlı testtir.',
      1: 'Mülakatta böyle anlat: "Baskı anında bile 5 dakikalık bir duman testi koşmak, saatler sürecek regresyon maliyetini önler."',
      2: 'Kontrol listene ekle: Acil hotfix durumunda dahi randevu oluşturma ve iptal akışlarını kapsayan otomatik smoke test koş.',
    },
  },
  3: {
    id: 3,
    stepName: 'K3',
    stageLabel: 'BÖLÜM 3 · KARAR 3: KVKK',
    shortTag: '03 // KVKK',
    title: 'Log\'u tedarikçiye gönderiyorsun; log\'da hasta adı ve T.C. kimlik no var.',
    incidentHeading: 'Vaka: Dış Entegratör ve Veri Güvenliği',
    triageSeverity: 'DATA PROTECTION · AUDIT',
    triageRef: 'REF: KVKK-SEC-LOG',
    triageWaitCount: '300 Hasta Kaydı',
    triageError: 'Hassas Veri Riski',
    hint: 'Bu logdaki hangi bilgiler hata ayıklamaya yarar, hangileri yalnızca kişiye aittir?',
    tutorTeachingTarget: 'veri minimizasyonu, maskeleme/anonimleştirme, özel nitelikli kişisel veri.',
    tutorDefaultQuestion: 'Tedarikçinin hatayı bulması için logdaki hangi alanlara ihtiyacı var?',
    options: {
      A: {
        id: 'A',
        title: 'Maskele, sonra gönder',
        subtitle: 'Hasta adı ve T.C. kimlik no\'ları anonimleştirerek ilet',
        riskBadge: { text: 'RİSK: DÜŞÜK', color: 'green' },
        etaBadge: 'ETA: 8 DK',
        durationMinutes: 8,
        whatHappened: 'İsim ve T.C. no maskelendi; tedarikçi hatayı yine buldu.',
        whyHappened: 'Sağlık verisi özel nitelikli kişisel veridir (KVKK md. 6). Veri sorumlusu, veriyi amaçla sınırlı ve ölçülü işlemekle (md. 4) ve güvenliğini sağlamakla (md. 12) yükümlüdür.',
        assessmentTitle: 'Loglar Maskelendi & Güvenli Aktarıldı',
        summarySentence: 'Sağlık verisi özel nitelikli kişisel veridir; tedarikçiye kimlik bilgisi gitmedi.',
      },
      B: {
        id: 'B',
        title: 'Ekibe olduğu gibi at',
        subtitle: 'Logları ham hâliyle dış tedarikçiye hızlıca ilet',
        riskBadge: { text: 'RİSK: KRİTİK', color: 'red' },
        etaBadge: 'ETA: ANLIK',
        durationMinutes: 0,
        whatHappened: 'Loglar ham hâliyle dış ekibe gitti.',
        whyHappened: 'Hata ayıklamak için hasta kimliğine ihtiyaç yoktu. Gereksiz aktarım, özel nitelikli verinin ihlali demektir.',
        assessmentTitle: 'Ham Loglar Tedarikçiye Gönderildi',
        summarySentence: 'Sağlık verisi özel nitelikli kişisel veridir; gereksiz aktarım ihlaldir.',
      },
    },
    goalInsights: {
      0: 'Kavram: Veri minimizasyonu, kişisel verilerin sadece amaca hizmet eden zorunlu kısımlarının işlenmesi ilkesidir.',
      1: 'Mülakatta böyle anlat: "KVKK Madde 6 uyarınca sağlık verisi özel niteliklidir; log analizi için üçüncü tarafa aktarırken maskeleme yasal zorunluluktur."',
      2: 'Kontrol listene ekle: Loglama altyapısında T.C. kimlik ve hasta isimlerini kaydedilmeden önce maskeleyen PII filtresi devreye al.',
    },
  },
};
