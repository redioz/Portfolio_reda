'use server';

/**
 * Server Actions pour récupérer les données KPI
 */

import { getCachedKpiData, getLatestWeekData, getLastNWeeks } from './google-sheets';
import { generateQuickWins, generateAllQuickWins } from './quick-wins';
import { KpiRow, QuickWin, AggregatedKpis } from './types';

/**
 * Récupère toutes les données KPI
 */
export async function getKpis(): Promise<KpiRow[]> {
  try {
    const data = await getCachedKpiData();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des KPIs:', error);
    return [];
  }
}

/**
 * Récupère les données de la semaine la plus récente
 */
export async function getLatestKpis(): Promise<KpiRow | null> {
  try {
    const data = await getLatestWeekData();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des KPIs récents:', error);
    return null;
  }
}

/**
 * Récupère les N dernières semaines
 */
export async function getRecentKpis(weeks: number = 4): Promise<KpiRow[]> {
  try {
    const data = await getLastNWeeks(weeks);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des KPIs récents:', error);
    return [];
  }
}

/**
 * Récupère les Quick Wins pour la semaine la plus récente
 */
export async function getLatestQuickWins(): Promise<QuickWin[]> {
  try {
    const data = await getLastNWeeks(2); // Besoin de 2 semaines pour comparaison

    if (data.length === 0) return [];

    const [current, previous] = data;
    const allData = await getCachedKpiData();

    return generateQuickWins(current, previous, allData);
  } catch (error) {
    console.error('Erreur lors de la génération des Quick Wins:', error);
    return [];
  }
}

/**
 * Récupère tous les Quick Wins pour toutes les semaines
 */
export async function getAllQuickWins(): Promise<Map<string, QuickWin[]>> {
  try {
    const data = await getCachedKpiData();
    return generateAllQuickWins(data);
  } catch (error) {
    console.error('Erreur lors de la génération des Quick Wins:', error);
    return new Map();
  }
}

/**
 * Calcule les KPIs agrégés
 */
export async function getAggregatedKpis(): Promise<AggregatedKpis> {
  try {
    const data = await getCachedKpiData();

    if (data.length === 0) {
      return {
        totalSpend: 0,
        totalImpr: 0,
        totalClics: 0,
        totalSurveys: 0,
        totalCalls: 0,
        totalSales: 0,
        totalCash: 0,
        avgCTR: 0,
        avgCPC: 0,
        avgCPM: 0,
        avgROASCash: 0,
        avgTauxQualif: 0,
        avgTauxConv: 0,
      };
    }

    const totals = data.reduce(
      (acc, row) => {
        acc.spend += row.spend;
        acc.impr += row.impr;
        acc.clics += row.clics;
        acc.surveys += row.nbrDeSurveys;
        acc.calls += row.nbrDeCallRealise;
        acc.sales += row.salesN;
        acc.cash += row.cashCollecte;
        acc.ctr += row.ctr;
        acc.cpc += row.cpc;
        acc.cpm += row.cpm;
        acc.roasCash += row.roasCash;
        acc.tauxQualif += row.tauxDeQualif;
        acc.tauxConv += row.tauxDeConv;
        return acc;
      },
      {
        spend: 0,
        impr: 0,
        clics: 0,
        surveys: 0,
        calls: 0,
        sales: 0,
        cash: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roasCash: 0,
        tauxQualif: 0,
        tauxConv: 0,
      }
    );

    const count = data.length;

    return {
      totalSpend: totals.spend,
      totalImpr: totals.impr,
      totalClics: totals.clics,
      totalSurveys: totals.surveys,
      totalCalls: totals.calls,
      totalSales: totals.sales,
      totalCash: totals.cash,
      avgCTR: totals.ctr / count,
      avgCPC: totals.cpc / count,
      avgCPM: totals.cpm / count,
      avgROASCash: totals.roasCash / count,
      avgTauxQualif: totals.tauxQualif / count,
      avgTauxConv: totals.tauxConv / count,
    };
  } catch (error) {
    console.error('Erreur lors du calcul des KPIs agrégés:', error);
    throw error;
  }
}
