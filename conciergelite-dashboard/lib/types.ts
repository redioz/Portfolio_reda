/**
 * Types pour les KPIs ConciergElite
 * Basés sur les colonnes du Google Sheet (onglet OCTOBRE)
 */

// Type pour une ligne brute du Sheet
export interface KpiRow {
  // Identifiant
  weekId: string; // Format: "2024-W42"
  weekLabel: string; // "Stat de la semaine du"
  weekDate: Date;

  // Paid Media
  spend: number; // Dépenses publicitaires
  impr: number; // Impressions
  cpm: number; // Coût pour mille impressions
  clics: number; // Nombre de clics
  cpc: number; // Coût par clic
  ctr: number; // Click-through rate (0-1, ex: 0.023 = 2.3%)
  hookRate: number; // Taux d'accroche (0-1)
  vcr10: number; // Video completion rate 10% (0-1)
  vcr30: number; // Video completion rate 30% (0-1)
  vcr50: number; // Video completion rate 50% (0-1)
  vcr100: number; // Video completion rate 100% (0-1)

  // Lead → Call
  nbrDeSurveys: number; // Nombre de surveys/formulaires remplis
  coutParSurveys: number; // Coût par survey
  nbrDeCallRealise: number; // Nombre d'appels réalisés
  nbrCallsDisqualif: number; // Nombre d'appels disqualifiés
  coutParCall: number; // Coût par appel
  lpcCallsClics: number; // Lead-to-call conversion rate (0-1)
  sur: number; // Survey completion rate (0-1)
  tauxDeQualif: number; // Taux de qualification (0-1)
  tr3jCalendrier: number; // Taux de rendez-vous tenus sous 3 jours (0-1)
  tauxDeConv: number; // Taux de conversion global (0-1)

  // Sales/Revenue
  closerStatusGood: boolean; // Statut du closer (bon/pas bon)
  salesN: number; // Nombre de ventes
  volDaffaire: number; // Volume d'affaires (€)
  cashCollecte: number; // Cash collecté (€)
  roasVA: number; // ROAS sur volume d'affaires
  roasCash: number; // ROAS sur cash collecté
}

// Type pour les données agrégées
export interface AggregatedKpis {
  totalSpend: number;
  totalImpr: number;
  totalClics: number;
  totalSurveys: number;
  totalCalls: number;
  totalSales: number;
  totalCash: number;
  avgCTR: number;
  avgCPC: number;
  avgCPM: number;
  avgROASCash: number;
  avgTauxQualif: number;
  avgTauxConv: number;
}

// Type pour les deltas (comparaison période N vs N-1)
export interface Delta {
  absolute: number; // Différence absolue
  percentage: number; // Différence en %
  trend: 'up' | 'down' | 'stable'; // Tendance
}

// Type pour une carte KPI avec delta
export interface KpiCardData {
  label: string;
  value: number | string;
  delta?: Delta;
  format: 'number' | 'currency' | 'percentage';
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
}

// Type pour les Quick Wins
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Tag = "CREA" | "MEDIA" | "FUNNEL" | "SALES" | "OPS";

export interface QuickWin {
  id: string; // Format: `${weekId}-${ruleId}`
  title: string; // "CTR faible : refresh créa"
  reason: string; // "CTR 0,9% < 1% (−0,3 pt vs N-1)"
  action: string; // "Tester 3 hooks + 2 angles…"
  impact: string; // "↑ CTR attendu +0,5–1,0 pt"
  priority: Priority;
  tag: Tag;
  weekId?: string; // Optionnel : pour lier à une semaine
}

// Type pour les filtres de période
export type PeriodFilter =
  | 'this-week'
  | 'last-7-days'
  | 'last-30-days'
  | 'this-month'
  | 'last-month'
  | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

// Type pour les données du graphique
export interface ChartDataPoint {
  date: string; // Format ISO ou label
  [key: string]: string | number; // Métriques dynamiques
}

// Type pour le funnel de conversion
export interface FunnelStage {
  name: string;
  value: number;
  percentage: number; // % du stage précédent
  color?: string;
}

// Type pour la réponse de l'API Google Sheets
export interface SheetResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

// Type pour les mapping des colonnes du Sheet
export interface ColumnMapping {
  [key: string]: number; // Nom de la colonne → index
}

// Configuration du Sheet
export interface SheetConfig {
  spreadsheetId: string;
  range: string; // Ex: "OCTOBRE!A1:AB100"
  sheetName: string; // Ex: "OCTOBRE"
}

// Type pour le cache
export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en ms
}

// Type pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
