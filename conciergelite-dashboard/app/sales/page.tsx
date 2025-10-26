import { DollarSign, TrendingUp, Euro, Percent, Target } from 'lucide-react';
import { KpiCard } from '@/components/kpi/kpi-card';
import { getRecentKpis } from '@/lib/actions';
import { calculateDelta } from '@/lib/sheet-parser';

export const revalidate = 60;

export default async function SalesPage() {
  const data = await getRecentKpis(2);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  const [current, previous] = data;

  // Calculer les deltas
  const salesDelta = previous ? calculateDelta(current.salesN, previous.salesN) : undefined;
  const vaDelta = previous ? calculateDelta(current.volDaffaire, previous.volDaffaire) : undefined;
  const cashDelta = previous ? calculateDelta(current.cashCollecte, previous.cashCollecte) : undefined;
  const roasVaDelta = previous ? calculateDelta(current.roasVA, previous.roasVA) : undefined;
  const roasCashDelta = previous ? calculateDelta(current.roasCash, previous.roasCash) : undefined;

  // Calculs dérivés
  const ticketMoyen = current.salesN > 0 ? current.volDaffaire / current.salesN : 0;
  const prevTicketMoyen = previous && previous.salesN > 0 ? previous.volDaffaire / previous.salesN : 0;
  const ticketMoyenDelta = previous && prevTicketMoyen > 0
    ? calculateDelta(ticketMoyen, prevTicketMoyen)
    : undefined;

  const tauxCollection = current.volDaffaire > 0 ? (current.cashCollecte / current.volDaffaire) : 0;
  const prevTauxCollection = previous && previous.volDaffaire > 0
    ? (previous.cashCollecte / previous.volDaffaire)
    : 0;
  const tauxCollectionDelta = previous && prevTauxCollection > 0
    ? calculateDelta(tauxCollection, prevTauxCollection)
    : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          💰 Sales & Revenue
        </h1>
        <p className="text-muted-foreground mt-2">
          Performance commerciale • Semaine du {current.weekLabel}
        </p>
      </div>

      {/* Volume */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Volume des ventes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Nombre de Sales"
            value={current.salesN}
            delta={salesDelta}
            format="number"
            icon={Target}
            delay={0}
          />
          <KpiCard
            label="Ticket Moyen"
            value={ticketMoyen}
            delta={ticketMoyenDelta}
            format="currency"
            icon={DollarSign}
            delay={0.05}
          />
          <KpiCard
            label="Closer OK"
            value={current.closerStatusGood ? 1 : 0}
            format="number"
            icon={TrendingUp}
            delay={0.1}
          />
        </div>
      </section>

      {/* Revenue */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Chiffre d&apos;affaires</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <KpiCard
            label="Volume d&apos;Affaires"
            value={current.volDaffaire}
            delta={vaDelta}
            format="currency"
            icon={DollarSign}
            delay={0}
          />
          <KpiCard
            label="Cash Collecté"
            value={current.cashCollecte}
            delta={cashDelta}
            format="currency"
            icon={Euro}
            delay={0.05}
          />
        </div>
      </section>

      {/* ROAS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Rentabilité (ROAS)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="ROAS Volume d'Affaires"
            value={current.roasVA}
            delta={roasVaDelta}
            format="number"
            icon={Percent}
            delay={0}
          />
          <KpiCard
            label="ROAS Cash Collecté"
            value={current.roasCash}
            delta={roasCashDelta}
            format="number"
            icon={Percent}
            delay={0.05}
          />
          <KpiCard
            label="Taux de Collection"
            value={tauxCollection}
            delta={tauxCollectionDelta}
            format="percentage"
            icon={Percent}
            delay={0.1}
          />
        </div>
      </section>

      {/* Breakdown */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Décomposition</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Dépenses Publicitaires</p>
            <p className="text-3xl font-bold">{current.spend.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Volume d&apos;Affaires</p>
            <p className="text-3xl font-bold">{current.volDaffaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Cash Collecté</p>
            <p className="text-3xl font-bold">{current.cashCollecte.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Bénéfice Brut (Cash - Spend)</p>
            <p className={`text-3xl font-bold ${current.cashCollecte - current.spend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {(current.cashCollecte - current.spend).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Coût par Sale</p>
            <p className="text-3xl font-bold">
              {current.salesN > 0 ? (current.spend / current.salesN).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '0 €'}
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Marge Nette (%)</p>
            <p className={`text-3xl font-bold ${((current.cashCollecte - current.spend) / current.cashCollecte * 100) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {current.cashCollecte > 0 ? ((current.cashCollecte - current.spend) / current.cashCollecte * 100).toFixed(1) : '0'}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
