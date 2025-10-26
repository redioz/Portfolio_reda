import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'ConciergElite Dashboard - KPIs en temps réel',
  description: 'Dashboard interactif pour suivre les KPIs d\'acquisition et de vente de ConciergElite',
  keywords: ['dashboard', 'kpi', 'analytics', 'conciergelite'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="relative min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <div className="container py-6">
                  {children}
                </div>
              </main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ConciergElite. Tous droits réservés.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Propulsé par Next.js 14 & Google Sheets API
                  </p>
                </div>
              </footer>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
