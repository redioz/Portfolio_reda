import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes avec gestion des conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formate une valeur monétaire
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formate une date
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'long') {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  return new Intl.DateTimeFormat('fr-FR').format(date);
}

/**
 * Formate un delta avec signe et couleur
 */
export function formatDelta(
  value: number,
  format: 'number' | 'percentage' = 'percentage'
): { text: string; color: string; isPositive: boolean } {
  const isPositive = value >= 0;
  const sign = isPositive ? '+' : '';

  let text = '';
  if (format === 'percentage') {
    text = `${sign}${value.toFixed(1)}%`;
  } else {
    text = `${sign}${formatNumber(value, 2)}`;
  }

  // Couleur : vert pour positif, rouge pour négatif
  const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return { text, color, isPositive };
}

/**
 * Calcule une couleur d'intensité basée sur une valeur (pour heatmaps)
 */
export function getIntensityColor(value: number, min: number, max: number): string {
  const normalized = (value - min) / (max - min);

  if (normalized < 0.33) return 'bg-red-100 dark:bg-red-900/20';
  if (normalized < 0.67) return 'bg-yellow-100 dark:bg-yellow-900/20';
  return 'bg-green-100 dark:bg-green-900/20';
}

/**
 * Génère un ID unique
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Tronque un texte
 */
export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Vérifie si une valeur est un nombre valide
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
