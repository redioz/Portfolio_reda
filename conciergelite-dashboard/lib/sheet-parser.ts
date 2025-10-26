/**
 * Parseur de données Google Sheet pour ConciergElite
 * Gère les formats français : espaces dans les nombres, virgules décimales, pourcentages
 */

import { KpiRow, ColumnMapping } from './types';

/**
 * Normalise un nombre au format français
 * "1 700" → 1700
 * "1,5" → 1.5
 * "1 700,50" → 1700.50
 */
export function parseNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;

  // Nettoyer la chaîne : supprimer espaces et remplacer virgule par point
  const cleaned = value
    .toString()
    .trim()
    .replace(/\s+/g, '') // Supprimer tous les espaces
    .replace(',', '.'); // Virgule → point

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse un pourcentage
 * "23%" → 0.23
 * "23,5 %" → 0.235
 */
export function parsePercentage(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;

  // Retirer le symbole %, puis parser
  const cleaned = value.toString().replace('%', '').trim();
  const number = parseNumber(cleaned);

  // Si la valeur était déjà en décimal (ex: 0.23), on ne divise pas
  return number > 1 ? number / 100 : number;
}

/**
 * Parse une date au format français
 * "01/10/2024" → Date
 */
export function parseDate(value: string | Date | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;

  // Format français dd/mm/yyyy
  const parts = value.toString().split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(p => parseInt(p, 10));
    return new Date(year, month - 1, day);
  }

  // Fallback : format ISO
  return new Date(value);
}

/**
 * Parse un booléen
 * "Oui" / "Yes" / "TRUE" → true
 */
export function parseBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;

  const str = value.toString().toLowerCase().trim();
  return ['oui', 'yes', 'true', '1', 'x'].includes(str);
}

/**
 * Génère un ID de semaine
 * Date → "2024-W42"
 */
export function getWeekId(date: Date): string {
  const weekNumber = getWeekNumber(date);
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Calcule le numéro de semaine ISO
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Crée le mapping des colonnes à partir de la ligne d'en-tête
 */
export function createColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};

  headers.forEach((header, index) => {
    const normalized = header.trim().toLowerCase();
    mapping[normalized] = index;
  });

  return mapping;
}

/**
 * Récupère une valeur de cellule de manière safe
 */
function getCellValue(row: string[], mapping: ColumnMapping, columnName: string): string {
  const index = mapping[columnName.toLowerCase()];
  return index !== undefined && row[index] !== undefined ? row[index] : '';
}

/**
 * Parse une ligne brute du Sheet en KpiRow typé
 */
export function parseRow(row: string[], mapping: ColumnMapping): KpiRow | null {
  try {
    // Date de la semaine (première colonne)
    const weekLabel = getCellValue(row, mapping, 'stat de la semaine du');
    if (!weekLabel) return null; // Ligne vide

    const weekDate = parseDate(weekLabel);
    const weekId = getWeekId(weekDate);

    return {
      weekId,
      weekLabel,
      weekDate,

      // Paid Media
      spend: parseNumber(getCellValue(row, mapping, 'spend')),
      impr: parseNumber(getCellValue(row, mapping, 'impr')),
      cpm: parseNumber(getCellValue(row, mapping, 'cpm')),
      clics: parseNumber(getCellValue(row, mapping, 'clics')),
      cpc: parseNumber(getCellValue(row, mapping, 'cpc')),
      ctr: parsePercentage(getCellValue(row, mapping, 'ctr')),
      hookRate: parsePercentage(getCellValue(row, mapping, 'hook rate')),
      vcr10: parsePercentage(getCellValue(row, mapping, 'vcr 10%')),
      vcr30: parsePercentage(getCellValue(row, mapping, 'vcr 30%')),
      vcr50: parsePercentage(getCellValue(row, mapping, 'vcr 50%')),
      vcr100: parsePercentage(getCellValue(row, mapping, 'vcr 100%')),

      // Lead → Call
      nbrDeSurveys: parseNumber(getCellValue(row, mapping, 'nbr de surveys')),
      coutParSurveys: parseNumber(getCellValue(row, mapping, 'cout par surveys')),
      nbrDeCallRealise: parseNumber(getCellValue(row, mapping, 'nbr de call réalisé')),
      nbrCallsDisqualif: parseNumber(getCellValue(row, mapping, 'nbr calls disqualif')),
      coutParCall: parseNumber(getCellValue(row, mapping, 'cout par call')),
      lpcCallsClics: parsePercentage(getCellValue(row, mapping, 'lpc calls/clics')),
      sur: parsePercentage(getCellValue(row, mapping, 'sur')),
      tauxDeQualif: parsePercentage(getCellValue(row, mapping, 'taux de qualif')),
      tr3jCalendrier: parsePercentage(getCellValue(row, mapping, 'tr 3j calendrier')),
      tauxDeConv: parsePercentage(getCellValue(row, mapping, 'taux de conv')),

      // Sales/Revenue
      closerStatusGood: parseBoolean(getCellValue(row, mapping, 'closer status good?')),
      salesN: parseNumber(getCellValue(row, mapping, 'sales n')),
      volDaffaire: parseNumber(getCellValue(row, mapping, "vol d'affaire")),
      cashCollecte: parseNumber(getCellValue(row, mapping, 'cash collecte')),
      roasVA: parseNumber(getCellValue(row, mapping, 'roas va')),
      roasCash: parseNumber(getCellValue(row, mapping, 'roas cash')),
    };
  } catch (error) {
    console.error('Erreur lors du parsing de la ligne:', error);
    return null;
  }
}

/**
 * Parse toutes les lignes du Sheet
 */
export function parseSheet(values: string[][]): KpiRow[] {
  if (!values || values.length < 2) return [];

  // Première ligne = en-têtes
  const headers = values[0];
  const mapping = createColumnMapping(headers);

  // Lignes suivantes = données
  const rows = values.slice(1);

  return rows
    .map(row => parseRow(row, mapping))
    .filter((row): row is KpiRow => row !== null);
}

/**
 * Calcule le delta entre deux valeurs
 */
export function calculateDelta(current: number, previous: number): {
  absolute: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
} {
  const absolute = current - previous;
  const percentage = previous !== 0 ? (absolute / previous) * 100 : 0;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(percentage) < 1) {
    trend = 'stable';
  } else if (absolute > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return { absolute, percentage, trend };
}
