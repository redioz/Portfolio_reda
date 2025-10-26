import { Target, Phone, CheckCircle, Calendar, Percent, DollarSign, TrendingUp } from 'lucide-react';
import { KpiCard } from '@/components/kpi/kpi-card';
import { getRecentKpis } from '@/lib/actions';
import { calculateDelta } from '@/lib/sheet-parser';

export const revalidate = 60;

export default async function PipelinePage() {
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
  const surveysDelta = previous ? calculateDelta(current.nbrDeSurveys, previous.nbrDeSurveys) : undefined;
  const callsDelta = previous ? calculateDelta(current.nbrDeCallRealise, previous.nbrDeCallRealise) : undefined;
  const disqualifDelta = previous ? calculateDelta(current.nbrCallsDisqualif, previous.nbrCallsDisqualif) : undefined;
  const lpcDelta = previous ? calculateDelta(current.lpcCallsClics, previous.lpcCallsClics) : undefined;
  const surDelta = previous ? calculateDelta(current.sur, previous.sur) : undefined;
  const qualifDelta = previous ? calculateDelta(current.tauxDeQualif, previous.tauxDeQualif) : undefined;
  const tr3jDelta = previous ? calculateDelta(current.tr3jCalendrier, previous.tr3jCalendrier) : undefined;
  const convDelta = previous ? calculateDelta(current.tauxDeConv, previous.tauxDeConv) : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          🎯 Pipeline Lead → Call
        </h1>
        <p className="text-muted-foreground mt-2">
          Entonnoir de conversion • Semaine du {current.weekLabel}
        </p>
      </div>

      {/* Volume */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Volume & Coûts</h2>
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
            label="Coût par Survey"
            value={current.coutParSurveys}
            format="currency"
            icon={DollarSign}
            delay={0.05}
          />
          <KpiCard
            label="Calls réalisés"
            value={current.nbrDeCallRealise}
            delta={callsDelta}
            format="number"
            icon={Phone}
            delay={0.1}
          />
          <KpiCard
            label="Coût par Call"
            value={current.coutParCall}
            format="currency"
            icon={DollarSign}
            delay={0.15}
          />
        </div>
      </section>

      {/* Conversion */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Taux de conversion</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="LPC (Calls/Clics)"
            value={current.lpcCallsClics}
            delta={lpcDelta}
            format="percentage"
            icon={Percent}
            delay={0}
          />
          <KpiCard
            label="SUR"
            value={current.sur}
            delta={surDelta}
            format="percentage"
            icon={Percent}
            delay={0.05}
          />
          <KpiCard
            label="Taux de Qualif"
            value={current.tauxDeQualif}
            delta={qualifDelta}
            format="percentage"
            icon={CheckCircle}
            delay={0.1}
          />
          <KpiCard
            label="Taux de Conv Global"
            value={current.tauxDeConv}
            delta={convDelta}
            format="percentage"
            icon={TrendingUp}
            delay={0.15}
          />
        </div>
      </section>

      {/* Qualité */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Qualité & Show Rate</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Calls disqualifiés"
            value={current.nbrCallsDisqualif}
            delta={disqualifDelta}
            format="number"
            icon={Phone}
            delay={0}
          />
          <KpiCard
            label="RDV tenus (3j)"
            value={current.tr3jCalendrier}
            delta={tr3jDelta}
            format="percentage"
            icon={Calendar}
            delay={0.05}
          />
          <KpiCard
            label="Closer OK"
            value={current.closerStatusGood ? 1 : 0}
            format="number"
            icon={CheckCircle}
            delay={0.1}
          />
        </div>
      </section>

      {/* Entonnoir visuel */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Entonnoir de conversion</h2>
        <div className="bg-card rounded-2xl border p-6">
          <div className="space-y-4">
            <FunnelStage
              label="Clics publicitaires"
              value={current.clics}
              percentage={100}
              color="bg-blue-500"
            />
            <FunnelStage
              label="Surveys complétés"
              value={current.nbrDeSurveys}
              percentage={(current.nbrDeSurveys / current.clics) * 100}
              color="bg-purple-500"
            />
            <FunnelStage
              label="Calls réalisés"
              value={current.nbrDeCallRealise}
              percentage={(current.nbrDeCallRealise / current.nbrDeSurveys) * 100}
              color="bg-indigo-500"
            />
            <FunnelStage
              label="Calls qualifiés"
              value={Math.round(current.nbrDeCallRealise * current.tauxDeQualif)}
              percentage={current.tauxDeQualif * 100}
              color="bg-green-500"
            />
            <FunnelStage
              label="Sales"
              value={current.salesN}
              percentage={current.tauxDeConv * 100}
              color="bg-primary"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface FunnelStageProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function FunnelStage({ label, value, percentage, color }: FunnelStageProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value.toLocaleString('fr-FR')} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full h-8 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 flex items-center justify-end px-4`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          <span className="text-white text-xs font-bold">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
