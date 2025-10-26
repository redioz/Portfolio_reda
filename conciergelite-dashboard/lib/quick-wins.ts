/**
 * Moteur de Quick Wins pour ConciergElite
 * Génère des recommandations priorisées basées sur les KPIs
 */

import { KpiRow, QuickWin, Priority, Tag } from './types';

/**
 * Calcule le delta entre deux valeurs (avec gestion des cas null/undefined)
 */
function delta(current?: number, previous?: number): number | null {
  if (current == null || previous == null) return null;
  return current - previous;
}

/**
 * Formate un delta en points de pourcentage
 */
function formatPctDelta(current?: number, previous?: number): string {
  const d = delta(current, previous);
  if (d === null) return '';
  const sign = d >= 0 ? '+' : '';
  return ` (${sign}${(d * 100).toFixed(1)} pt vs N-1)`;
}

/**
 * Calcule la médiane d'un tableau de nombres
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Génère les Quick Wins pour une semaine donnée
 */
export function generateQuickWins(
  row: KpiRow,
  previousRow?: KpiRow,
  allRows?: KpiRow[]
): QuickWin[] {
  const wins: QuickWin[] = [];

  // ==================== RÈGLES CRÉA / ACQUISITION ====================

  // Règle 1: CTR < 1.0%
  if (row.ctr < 0.01) {
    wins.push({
      id: `${row.weekId}-CTR`,
      title: 'CTR faible : refresh créa',
      reason: `CTR ${(row.ctr * 100).toFixed(1)}% < 1%${formatPctDelta(row.ctr, previousRow?.ctr)}`,
      action: 'Tourner 3 nouvelles créas (2 hooks nouveaux, 1 remake best-of). Varier 1 angle pain, 1 proof, 1 process. Lancer A/B 48–72h.',
      impact: '↑ CTR attendu +0,5–1,5 pt',
      priority: 'HIGH',
      tag: 'CREA',
      weekId: row.weekId,
    });
  }

  // Règle 2: Hook Rate < 25% OU VCR 10% < 40%
  if (row.hookRate < 0.25 || row.vcr10 < 0.40) {
    const metric = row.hookRate < 0.25 ? 'Hook Rate' : 'VCR 10%';
    const value = row.hookRate < 0.25 ? row.hookRate : row.vcr10;
    wins.push({
      id: `${row.weekId}-HOOK`,
      title: 'Hook faible : réécrire 5 premières secondes',
      reason: `${metric} ${(value * 100).toFixed(1)}% < seuil`,
      action: 'Ajouter pattern interrupt + promesse chiffrée + CTA verbal 0–3s.',
      impact: '↑ Hook attendu +8–15 pt',
      priority: 'HIGH',
      tag: 'CREA',
      weekId: row.weekId,
    });
  }

  // Règle 3: CPC > 1,20€ ET CPM > 10€
  if (row.cpc > 1.20 && row.cpm > 10) {
    wins.push({
      id: `${row.weekId}-CPC`,
      title: 'Ciblage/Média à optimiser',
      reason: `CPC ${row.cpc.toFixed(2)}€ > 1,20€ et CPM ${row.cpm.toFixed(2)}€ > 10€`,
      action: 'Dupliquer best adset en broad, cap budget sur losers, tester placements natifs (Reels/Stories).',
      impact: '↓ CPC attendu −15–25%',
      priority: 'MEDIUM',
      tag: 'MEDIA',
      weekId: row.weekId,
    });
  }

  // Règle 4: Impr en baisse > −30% vs N-1 avec CPM↑
  if (previousRow) {
    const imprDelta = delta(row.impr, previousRow.impr);
    if (imprDelta !== null && imprDelta < -0.30 * previousRow.impr && row.cpm > previousRow.cpm) {
      wins.push({
        id: `${row.weekId}-IMPR`,
        title: 'Pression d\'enchère : remonter bid',
        reason: `Impressions −${Math.abs((imprDelta / previousRow.impr) * 100).toFixed(0)}% et CPM en hausse`,
        action: 'Incremental budget +20% sur winners, dayparting heures haut CTR.',
        impact: '↑ Reach attendu +15–20%',
        priority: 'MEDIUM',
        tag: 'MEDIA',
        weekId: row.weekId,
      });
    }
  }

  // ==================== RÈGLES FUNNEL LEAD → CALL ====================

  // Règle 5: CPL (Survey) > 15€ OU Nbr De Surveys bas
  const medianSurveys = allRows ? median(allRows.map(r => r.nbrDeSurveys)) : 0;
  if (row.coutParSurveys > 15 || (allRows && row.nbrDeSurveys < medianSurveys * 0.5)) {
    wins.push({
      id: `${row.weekId}-CPL`,
      title: 'Form friction : réduire questions',
      reason: row.coutParSurveys > 15
        ? `CPL ${row.coutParSurveys.toFixed(2)}€ > 15€`
        : `Surveys ${row.nbrDeSurveys} < 50% médiane`,
      action: 'Passer de 10→6 questions, champs progressifs, auto-fill mobile.',
      impact: '↓ CPL attendu −20–35%',
      priority: 'HIGH',
      tag: 'FUNNEL',
      weekId: row.weekId,
    });
  }

  // Règle 6: Taux de Qualif < 40% OU Nbr Calls disqualif élevé (> 30%)
  const disqualifRate = row.nbrDeCallRealise > 0
    ? row.nbrCallsDisqualif / row.nbrDeCallRealise
    : 0;
  if (row.tauxDeQualif < 0.40 || disqualifRate > 0.30) {
    wins.push({
      id: `${row.weekId}-QUALIF`,
      title: 'Qualification faible : ajouter pré-filtre',
      reason: row.tauxDeQualif < 0.40
        ? `Taux de qualif ${(row.tauxDeQualif * 100).toFixed(1)}% < 40%`
        : `Calls disqualifiés ${(disqualifRate * 100).toFixed(0)}% > 30%`,
      action: 'Ajouter 2 knock-out questions (budget, dispo), texte d\'attente + SMS reminder.',
      impact: '↑ Qualif attendu +10–20 pt',
      priority: 'HIGH',
      tag: 'FUNNEL',
      weekId: row.weekId,
    });
  }

  // Règle 7: tr 3J Calendrier < 0.6 (rdv tenus < 60%)
  if (row.tr3jCalendrier < 0.6) {
    wins.push({
      id: `${row.weekId}-NOSHOW`,
      title: 'No-show élevé : renfort reminders',
      reason: `Show rate ${(row.tr3jCalendrier * 100).toFixed(0)}% < 60%`,
      action: 'Séquence J-1/J-0 : SMS + WhatsApp (preuve sociale + mini agenda). Lien replanification 1-clic.',
      impact: '↑ Show rate attendu +12–25 pt',
      priority: 'HIGH',
      tag: 'OPS',
      weekId: row.weekId,
    });
  }

  // ==================== RÈGLES SALES / REVENUE ====================

  // Règle 8: Taux de Conv < 8% avec Calls qualifiés suffisants
  const qualifiedCalls = row.nbrDeCallRealise * row.tauxDeQualif;
  if (row.tauxDeConv < 0.08 && qualifiedCalls >= 5) {
    wins.push({
      id: `${row.weekId}-CONV`,
      title: 'Argumentaire à cadrer',
      reason: `Taux de conv ${(row.tauxDeConv * 100).toFixed(1)}% < 8% avec ${qualifiedCalls.toFixed(0)} calls qualifiés`,
      action: 'Script SPICED + objection "je dois réfléchir" ; ajouter price anchoring 3 paliers + bonus time-limited.',
      impact: '↑ Conv attendu +3–6 pt',
      priority: 'HIGH',
      tag: 'SALES',
      weekId: row.weekId,
    });
  }

  // Règle 9: ROAS CASH < 1.0 et CASH COLLECTE en baisse > −20%
  if (previousRow) {
    const cashDelta = delta(row.cashCollecte, previousRow.cashCollecte);
    if (row.roasCash < 1.0 && cashDelta !== null && cashDelta < -0.20 * previousRow.cashCollecte) {
      wins.push({
        id: `${row.weekId}-ROAS`,
        title: 'Offre/Price à ajuster',
        reason: `ROAS CASH ${row.roasCash.toFixed(2)} < 1.0 et Cash −${Math.abs((cashDelta / previousRow.cashCollecte) * 100).toFixed(0)}%`,
        action: 'Tester offre stackée (bonus onboarding + garantie 30j), facilité paiement 3–6x.',
        impact: '↑ ROAS attendu +0,3–0,8',
        priority: 'HIGH',
        tag: 'SALES',
        weekId: row.weekId,
      });
    }
  }

  // Règle 10: SALES N stable mais VA↓
  if (previousRow) {
    const salesDelta = delta(row.salesN, previousRow.salesN);
    const vaDelta = delta(row.volDaffaire, previousRow.volDaffaire);
    if (salesDelta !== null && vaDelta !== null &&
        Math.abs(salesDelta) <= 1 && vaDelta < -0.10 * previousRow.volDaffaire) {
      wins.push({
        id: `${row.weekId}-AOV`,
        title: 'Ticket moyen en baisse',
        reason: `Sales stable (${row.salesN}) mais VA −${Math.abs((vaDelta / previousRow.volDaffaire) * 100).toFixed(0)}%`,
        action: 'Monter AOV via order bump (atelier yield manager), upsell coaching 1-1.',
        impact: '↑ VA attendu +10–20%',
        priority: 'MEDIUM',
        tag: 'SALES',
        weekId: row.weekId,
      });
    }
  }

  // ==================== RÈGLES QUALITÉ VIDÉO ====================

  // Règle 11: VCR 30% < 25% et VCR 10% > 40%
  if (row.vcr30 < 0.25 && row.vcr10 > 0.40) {
    wins.push({
      id: `${row.weekId}-VCR30`,
      title: 'Milieu faible : resserrer le core',
      reason: `VCR 30% ${(row.vcr30 * 100).toFixed(1)}% < 25% mais VCR 10% OK`,
      action: 'Couper 15–30s de fluff, ajouter preuve chiffrée minute 0:30–0:45.',
      impact: '↑ VCR30 attendu +8–12 pt',
      priority: 'MEDIUM',
      tag: 'CREA',
      weekId: row.weekId,
    });
  }

  // Règle 12: VCR 100% < 10% mais CTR élevé
  if (row.vcr100 < 0.10 && row.ctr > 0.015) {
    wins.push({
      id: `${row.weekId}-VCR100`,
      title: 'CTA trop tardif',
      reason: `VCR 100% ${(row.vcr100 * 100).toFixed(1)}% < 10% mais CTR ${(row.ctr * 100).toFixed(1)}% élevé`,
      action: 'Déplacer CTA à 15–20s + end card cliquable.',
      impact: '↑ Clicks attendu +10–18%',
      priority: 'LOW',
      tag: 'CREA',
      weekId: row.weekId,
    });
  }

  return prioritizeQuickWins(wins);
}

/**
 * Priorise les Quick Wins par score (impact × sévérité × rapidité)
 */
function prioritizeQuickWins(wins: QuickWin[]): QuickWin[] {
  // Scores de priorité
  const priorityScores: Record<Priority, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  // Trier par priorité puis par ordre d'insertion
  return wins.sort((a, b) => {
    const scoreDiff = priorityScores[b.priority] - priorityScores[a.priority];
    return scoreDiff !== 0 ? scoreDiff : 0;
  });
}

/**
 * Génère les Quick Wins pour toutes les semaines
 */
export function generateAllQuickWins(rows: KpiRow[]): Map<string, QuickWin[]> {
  const winsByWeek = new Map<string, QuickWin[]>();

  // Trier par date
  const sortedRows = [...rows].sort((a, b) => a.weekDate.getTime() - b.weekDate.getTime());

  sortedRows.forEach((row, index) => {
    const previousRow = index > 0 ? sortedRows[index - 1] : undefined;
    const wins = generateQuickWins(row, previousRow, sortedRows);

    // Garder seulement le top 5
    winsByWeek.set(row.weekId, wins.slice(0, 5));
  });

  return winsByWeek;
}

/**
 * Agrège tous les Quick Wins actifs (de la semaine en cours)
 */
export function getActiveQuickWins(allWins: Map<string, QuickWin[]>): QuickWin[] {
  // Récupérer les wins de toutes les semaines et les fusionner
  const allWinsArray: QuickWin[] = [];

  allWins.forEach(wins => {
    allWinsArray.push(...wins);
  });

  // Dédupliquer par ID et garder les plus récents
  const uniqueWins = new Map<string, QuickWin>();

  allWinsArray.forEach(win => {
    const baseId = win.id.split('-').slice(1).join('-'); // Retirer le weekId
    if (!uniqueWins.has(baseId) || (win.weekId && win.weekId > (uniqueWins.get(baseId)?.weekId || ''))) {
      uniqueWins.set(baseId, win);
    }
  });

  return Array.from(uniqueWins.values());
}
