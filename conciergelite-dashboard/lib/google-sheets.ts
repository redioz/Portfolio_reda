/**
 * Client Google Sheets API pour ConciergElite
 * Utilise un Service Account pour l'authentification
 */

import { google } from 'googleapis';
import { KpiRow, SheetConfig, SheetResponse } from './types';
import { parseSheet } from './sheet-parser';

// Configuration du Sheet (sera surchargée par les variables d'environnement)
const DEFAULT_CONFIG: SheetConfig = {
  spreadsheetId: process.env.GOOGLE_SHEET_ID || '',
  range: process.env.GOOGLE_SHEET_RANGE || 'OCTOBRE!A1:AB100',
  sheetName: process.env.GOOGLE_SHEET_NAME || 'OCTOBRE',
};

/**
 * Crée un client authentifié Google Sheets
 */
function getAuthClient() {
  try {
    // Les credentials sont stockés dans une variable d'environnement
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
      : null;

    if (!credentials) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY n\'est pas défini');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return auth;
  } catch (error) {
    console.error('Erreur lors de la création du client d\'authentification:', error);
    throw error;
  }
}

/**
 * Récupère les données du Google Sheet
 */
export async function fetchSheetData(config?: Partial<SheetConfig>): Promise<SheetResponse> {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    if (!finalConfig.spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID n\'est pas défini');
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: finalConfig.spreadsheetId,
      range: finalConfig.range,
    });

    return {
      range: response.data.range || '',
      majorDimension: response.data.majorDimension || 'ROWS',
      values: response.data.values || [],
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du Sheet:', error);
    throw error;
  }
}

/**
 * Récupère et parse les données KPI du Sheet
 */
export async function getKpiData(config?: Partial<SheetConfig>): Promise<KpiRow[]> {
  const sheetData = await fetchSheetData(config);

  if (!sheetData.values || sheetData.values.length === 0) {
    return [];
  }

  return parseSheet(sheetData.values);
}

/**
 * Récupère les données KPI pour une période donnée
 */
export async function getKpiDataForPeriod(
  from: Date,
  to: Date,
  config?: Partial<SheetConfig>
): Promise<KpiRow[]> {
  const allData = await getKpiData(config);

  return allData.filter(row => {
    return row.weekDate >= from && row.weekDate <= to;
  });
}

/**
 * Récupère les données de la semaine la plus récente
 */
export async function getLatestWeekData(config?: Partial<SheetConfig>): Promise<KpiRow | null> {
  const allData = await getKpiData(config);

  if (allData.length === 0) return null;

  // Trier par date décroissante
  const sorted = allData.sort((a, b) => b.weekDate.getTime() - a.weekDate.getTime());

  return sorted[0];
}

/**
 * Récupère les N dernières semaines
 */
export async function getLastNWeeks(n: number, config?: Partial<SheetConfig>): Promise<KpiRow[]> {
  const allData = await getKpiData(config);

  // Trier par date décroissante
  const sorted = allData.sort((a, b) => b.weekDate.getTime() - a.weekDate.getTime());

  return sorted.slice(0, n);
}

// Cache simple en mémoire (pour dev - en prod, utiliser Redis/KV)
let cache: { data: KpiRow[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 secondes

/**
 * Récupère les données avec cache
 */
export async function getCachedKpiData(config?: Partial<SheetConfig>): Promise<KpiRow[]> {
  const now = Date.now();

  // Vérifier le cache
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }

  // Fetch fresh data
  const data = await getKpiData(config);

  // Mettre à jour le cache
  cache = { data, timestamp: now };

  return data;
}

/**
 * Invalide le cache
 */
export function invalidateCache() {
  cache = null;
}
