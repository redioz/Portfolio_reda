import { Eye, MousePointerClick, DollarSign, TrendingUp, Play } from 'lucide-react';
import { KpiCard } from '@/components/kpi/kpi-card';
import { getRecentKpis } from '@/lib/actions';
import { calculateDelta } from '@/lib/sheet-parser';

export const revalidate = 60;

export default async function AcquisitionPage() {
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
  const spendDelta = previous ? calculateDelta(current.spend, previous.spend) : undefined;
  const imprDelta = previous ? calculateDelta(current.impr, previous.impr) : undefined;
  const clicsDelta = previous ? calculateDelta(current.clics, previous.clics) : undefined;
  const cpmDelta = previous ? calculateDelta(current.cpm, previous.cpm) : undefined;
  const cpcDelta = previous ? calculateDelta(current.cpc, previous.cpc) : undefined;
  const ctrDelta = previous ? calculateDelta(current.ctr, previous.ctr) : undefined;
  const hookDelta = previous ? calculateDelta(current.hookRate, previous.hookRate) : undefined;
  const vcr10Delta = previous ? calculateDelta(current.vcr10, previous.vcr10) : undefined;
  const vcr30Delta = previous ? calculateDelta(current.vcr30, previous.vcr30) : undefined;
  const vcr50Delta = previous ? calculateDelta(current.vcr50, previous.vcr50) : undefined;
  const vcr100Delta = previous ? calculateDelta(current.vcr100, previous.vcr100) : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          📈 Acquisition & Paid Media
        </h1>
        <p className="text-muted-foreground mt-2">
          Performance publicitaire • Semaine du {current.weekLabel}
        </p>
      </div>

      {/* Métriques principales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Investissement & Volume</h2>
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

      {/* Coûts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Efficacité des coûts</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="CPM"
            value={current.cpm}
            delta={cpmDelta}
            format="currency"
            icon={DollarSign}
            delay={0}
          />
          <KpiCard
            label="CPC"
            value={current.cpc}
            delta={cpcDelta}
            format="currency"
            icon={DollarSign}
            delay={0.05}
          />
          <KpiCard
            label="Hook Rate"
            value={current.hookRate}
            delta={hookDelta}
            format="percentage"
            icon={Play}
            delay={0.1}
          />
        </div>
      </section>

      {/* Vidéo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Performance Vidéo (VCR)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="VCR 10%"
            value={current.vcr10}
            delta={vcr10Delta}
            format="percentage"
            icon={Play}
            delay={0}
          />
          <KpiCard
            label="VCR 30%"
            value={current.vcr30}
            delta={vcr30Delta}
            format="percentage"
            icon={Play}
            delay={0.05}
          />
          <KpiCard
            label="VCR 50%"
            value={current.vcr50}
            delta={vcr50Delta}
            format="percentage"
            icon={Play}
            delay={0.1}
          />
          <KpiCard
            label="VCR 100%"
            value={current.vcr100}
            delta={vcr100Delta}
            format="percentage"
            icon={Play}
            delay={0.15}
          />
        </div>
      </section>
    </div>
  );
}
