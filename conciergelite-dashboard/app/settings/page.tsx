import { Settings, FileSpreadsheet, Zap, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          ⚙️ Configuration
        </h1>
        <p className="text-muted-foreground mt-2">
          Paramètres du dashboard et connexion Google Sheets
        </p>
      </div>

      {/* Google Sheets */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Google Sheets</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <CardTitle>Connexion au Sheet</CardTitle>
              </div>
              <CardDescription>
                Configuré via variables d&apos;environnement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sheet ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {process.env.GOOGLE_SHEET_ID?.substring(0, 20)}...
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Range:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {process.env.GOOGLE_SHEET_RANGE || 'OCTOBRE!A1:AB100'}
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Onglet:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {process.env.GOOGLE_SHEET_NAME || 'OCTOBRE'}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Mise à jour temps réel</CardTitle>
              </div>
              <CardDescription>
                Revalidation automatique via webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Webhook URL:</strong>
                </p>
                <code className="bg-muted px-2 py-1 rounded text-xs block">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://votre-domaine.vercel.app'}/api/revalidate
                </code>
                <p className="text-muted-foreground mt-2">
                  À configurer dans Google Apps Script (voir README)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Informations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Informations</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>À propos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Stack technique</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14 (App Router + Server Actions)</li>
                <li>• TypeScript 5</li>
                <li>• Tailwind CSS 3 + shadcn/ui</li>
                <li>• Framer Motion (animations)</li>
                <li>• Recharts (graphiques)</li>
                <li>• Google Sheets API</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Fonctionnalités</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Synchronisation temps réel avec Google Sheets</li>
                <li>✅ Quick Wins automatiques avec règles déterministes</li>
                <li>✅ Dark mode avec persistance</li>
                <li>✅ Animations fluides</li>
                <li>✅ Responsive mobile/desktop</li>
                <li>✅ Cache intelligent avec revalidation webhook</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Performance</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Revalidation: toutes les 60 secondes (ISR)</li>
                <li>• Cache TTL: 60 secondes</li>
                <li>• Webhook: revalidation instantanée sur modification du Sheet</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Développé avec ❤️ pour <strong className="text-foreground">ConciergElite</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
