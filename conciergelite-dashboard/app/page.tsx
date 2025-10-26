import {
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Phone,
  Target,
  Euro,
  Percent,
} from 'lucide-react';
import { KpiCard } from '@/components/kpi/kpi-card';
import { QuickWinCard } from '@/components/kpi/quick-win-card';
import { getRecentKpis, getLatestQuickWins } from '@/lib/actions';
import { calculateDelta } from '@/lib/sheet-parser';

export const revalidate = 60; // Revalider toutes les 60 secondes

export default async function OverviewPage() {
  const data = await getRecentKpis(2);
  const quickWins = await getLatestQuickWins();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Aucune donnée disponible
          </h2>
          <p className="text-muted-foreground">
            Vérifiez votre configuration Google Sheets
          </p>
        </div>
      </div>
    );
  }

  const [current, previous] = data;

  // Calculer les deltas
  const spendDelta = previous ? calculateDelta(current.spend, previous.spend) : undefined;
  const imprDelta = previous ? calculateDelta(current.impr, previous.impr) : undefined;
  const clicsDelta = previous ? calculateDelta(current.clics, previous.clics) : undefined;
  const ctrDelta = previous ? calculateDelta(current.ctr, previous.ctr) : undefined;
  const surveysDelta = previous ? calculateDelta(current.nbrDeSurveys, previous.nbrDeSurveys) : undefined;
  const callsDelta = previous ? calculateDelta(current.nbrDeCallRealise, previous.nbrDeCallRealise) : undefined;
  const qualifDelta = previous ? calculateDelta(current.tauxDeQualif, previous.tauxDeQualif) : undefined;
  const salesDelta = previous ? calculateDelta(current.salesN, previous.salesN) : undefined;
  const cashDelta = previous ? calculateDelta(current.cashCollecte, previous.cashCollecte) : undefined;
  const roasDelta = previous ? calculateDelta(current.roasCash, previous.roasCash) : undefined;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard <span className="text-primary">ConciergElite</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Semaine du {current.weekLabel} • Mise à jour automatique
        </p>
      </div>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">
            💡 Quick Wins & Insights
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickWins.slice(0, 6).map((win, index) => (
              <QuickWinCard key={win.id} quickWin={win} delay={index * 0.05} />
            ))}
          </div>
        </section>
      )}

      {/* KPIs Paid Media */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📊 Paid Media</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Dépenses"
            value={current.spend}
            delta={spendDelta}
            format="currency"
            icon={DollarSign}
            delay={0}
          />
          <KpiCard
            label="Impressions"
            value={current.impr}
            delta={imprDelta}
            format="number"
            icon={Eye}
            delay={0.05}
          />
          <KpiCard
            label="Clics"
            value={current.clics}
            delta={clicsDelta}
            format="number"
            icon={MousePointerClick}
            delay={0.1}
          />
          <KpiCard
            label="CTR"
            value={current.ctr}
            delta={ctrDelta}
            format="percentage"
            icon={TrendingUp}
            delay={0.15}
          />
        </div>
      </section>

      {/* KPIs Funnel */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🎯 Lead → Call</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Surveys"
            value={current.nbrDeSurveys}
            delta={surveysDelta}
            format="number"
            icon={Target}
            delay={0}
          />
          <KpiCard
            label="Calls réalisés"
            value={current.nbrDeCallRealise}
            delta={callsDelta}
            format="number"
            icon={Phone}
            delay={0.05}
          />
          <KpiCard
            label="Taux de Qualif"
            value={current.tauxDeQualif}
            delta={qualifDelta}
            format="percentage"
            icon={Percent}
            delay={0.1}
          />
          <KpiCard
            label="CPL Survey"
            value={current.coutParSurveys}
            format="currency"
            icon={DollarSign}
            delay={0.15}
          />
        </div>
      </section>

      {/* KPIs Sales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">💰 Sales & Revenue</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Sales"
            value={current.salesN}
            delta={salesDelta}
            format="number"
            icon={TrendingUp}
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
          <KpiCard
            label="Volume d'Affaires"
            value={current.volDaffaire}
            format="currency"
            icon={DollarSign}
            delay={0.1}
          />
          <KpiCard
            label="ROAS Cash"
            value={current.roasCash}
            delta={roasDelta}
            format="number"
            icon={Percent}
            delay={0.15}
          />
        </div>
      </section>
    </div>
  );
}
