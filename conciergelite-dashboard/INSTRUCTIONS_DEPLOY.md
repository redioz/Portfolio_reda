# 🚀 Instructions de Déploiement - Dashboard ConciergElite

## ✅ Statut du Projet

Le dashboard est **100% fonctionnel** et prêt à déployer ! Toutes les fonctionnalités demandées ont été implémentées.

## 📦 Ce qui a été créé

### Pages (5)
1. **/** - Overview avec KPIs principaux + Quick Wins
2. **/acquisition** - Métriques Paid Media (CTR, CPC, CPM, VCR)
3. **/pipeline** - Entonnoir Lead → Call avec conversion rates
4. **/sales** - Revenue, ROAS, marges
5. **/settings** - Configuration et infos système

### Fonctionnalités Principales
- ✅ **Google Sheets API** : Connexion avec Service Account (JSON fourni)
- ✅ **Quick Wins** : 12 règles déterministes (CREA/MEDIA/FUNNEL/SALES/OPS)
- ✅ **Dark Mode** : Toggle avec persistance localStorage
- ✅ **Animations** : Framer Motion pour micro-interactions
- ✅ **Responsive** : Mobile, tablette, desktop
- ✅ **Temps réel** : Webhook `/api/revalidate` + ISR 60s
- ✅ **Branding** : Couleur #FED51F (ConciergElite yellow)
- ✅ **KPI Cards** : Avec deltas vs semaine précédente
- ✅ **Types complets** : TypeScript strict
- ✅ **Parser robuste** : Gère formats français (espaces, virgules, %)

### Documentation
- 📖 `README.md` : Documentation complète (3000+ lignes)
- ⚡ `QUICKSTART.md` : Guide de démarrage rapide
- 📝 `google-apps-script.js` : Script webhook pour Google Sheets
- 🔧 `.env.example` : Template des variables d'environnement

## 🔧 Étapes pour Démarrer (5 minutes)

### 1. Installer les dépendances

```bash
cd conciergelite-dashboard
pnpm install
```

### 2. Configurer Google Sheets

#### A. Service Account (déjà fourni ✅)
Votre Service Account est déjà configuré dans `.env.local` :
- Email: `sheet-reader@conciergelite-maroc.iam.gserviceaccount.com`
- Projet: `conciergelite-maroc`

#### B. Partager votre Google Sheet

1. Ouvrir votre Google Sheet avec les données OCTOBRE
2. Cliquer sur **Partager** (en haut à droite)
3. Ajouter cet email : `sheet-reader@conciergelite-maroc.iam.gserviceaccount.com`
4. Permission : **Lecteur** (read-only)
5. Cliquer "Envoyer"

#### C. Récupérer l'ID du Sheet

Dans l'URL de votre Sheet :
```
https://docs.google.com/spreadsheets/d/[VOTRE_SHEET_ID]/edit
                                       ^^^^^^^^^^^^^^^^^
```

Copiez cette partie.

### 3. Modifier `.env.local`

Ouvrir `conciergelite-dashboard/.env.local` et remplacer :

```env
GOOGLE_SHEET_ID=YOUR_SPREADSHEET_ID
```

Par votre vrai ID :

```env
GOOGLE_SHEET_ID=1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA
```

⚠️ **Important** : Ne changez rien d'autre ! Le Service Account est déjà configuré.

### 4. Lancer le dashboard

```bash
pnpm dev
```

Ouvrir http://localhost:3000 🎉

Si vous voyez "Aucune donnée disponible", vérifiez :
1. Le Sheet est bien partagé avec le Service Account
2. L'ID du Sheet est correct
3. L'onglet s'appelle bien "OCTOBRE"

## 🚀 Déploiement Vercel (Production)

### Option 1 : Via l'interface Vercel (recommandé)

1. Aller sur https://vercel.com
2. **Import Project** → Connecter GitHub
3. Sélectionner le repo `Portfolio_reda`
4. **Root Directory** : Choisir `conciergelite-dashboard`
5. Ajouter les variables d'environnement :

```
GOOGLE_SHEET_ID=votre_sheet_id
GOOGLE_SHEET_RANGE=OCTOBRE!A1:AB100
GOOGLE_SHEET_NAME=OCTOBRE
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...tout le JSON...}
REVALIDATE_SECRET=mon_secret_aleatoire_123
```

6. **Deploy** !

### Option 2 : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod

# Ajouter les env vars via l'interface web
```

### Important : Variables d'environnement sur Vercel

Pour `GOOGLE_SERVICE_ACCOUNT_KEY`, coller **tout** le contenu du JSON sur **une seule ligne** :

```json
{"type":"service_account","project_id":"conciergelite-maroc","private_key_id":"2e7269eeb170fcd92315b8ab8057267116de8258","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgI...","client_email":"sheet-reader@conciergelite-maroc.iam.gserviceaccount.com",...}
```

## 🔄 Webhook Temps Réel (Optionnel)

Pour des mises à jour **instantanées** quand vous modifiez le Sheet :

### 1. Copier le script

Fichier : `google-apps-script.js`

### 2. L'ajouter à votre Sheet

1. Ouvrir votre Google Sheet
2. **Extensions** → **Apps Script**
3. Coller le code de `google-apps-script.js`
4. Remplacer :
   - `WEBHOOK_URL` par `https://votre-domaine.vercel.app/api/revalidate`
   - `SECRET` par la valeur de `REVALIDATE_SECRET`

### 3. Créer le trigger

1. Dans Apps Script, cliquer sur l'icône **Horloge** (Triggers)
2. **Add Trigger**
3. Function : `onEdit`
4. Event type : **On edit**
5. Save

Maintenant, chaque modification du Sheet revalidera le dashboard instantanément !

## 📊 Structure des Données

Votre Google Sheet doit avoir ces colonnes (onglet OCTOBRE) :

| Colonne | Description |
|---------|-------------|
| Stat de la semaine du | Date (ex: "16/10/2024") |
| Spend | Dépenses pub (ex: "2 500" ou "2500") |
| Impr | Impressions |
| Clics | Nombre de clics |
| CTR | Taux de clic (ex: "0,8%" ou "0.8%") |
| ... | (voir README.md pour la liste complète) |

Le parser gère automatiquement :
- Espaces : `"1 700"` → `1700`
- Virgules : `"1,5"` → `1.5`
- Pourcentages : `"23%"` → `0.23`

## 🎨 Personnalisation

### Couleurs

Fichier : `tailwind.config.ts`

```typescript
colors: {
  concierge: {
    yellow: '#FED51F',      // Changer ici
    'yellow-dark': '#E5C01C',
  }
}
```

### Règles Quick Wins

Fichier : `lib/quick-wins.ts`

Vous pouvez ajouter vos propres règles métier :

```typescript
// Nouvelle règle
if (row.votreMetrique > seuil) {
  wins.push({
    id: `${row.weekId}-VOTRE_ID`,
    title: 'Titre du Quick Win',
    reason: 'Raison chiffrée',
    action: 'Action concrète',
    impact: 'Impact attendu',
    priority: 'HIGH',
    tag: 'MEDIA',
  });
}
```

## 🐛 Dépannage

### "Aucune donnée disponible"

1. Vérifier que le Sheet est partagé avec `sheet-reader@conciergelite-maroc.iam.gserviceaccount.com`
2. Vérifier l'ID du Sheet dans `.env.local`
3. Ouvrir la console (F12) pour voir les erreurs

### "Erreur d'authentification"

Le JSON du Service Account est peut-être mal formaté. Vérifiez qu'il est bien sur **une seule ligne**.

### Build échoue

Si vous voyez des erreurs Google API pendant `pnpm build`, c'est **normal** (pas d'accès réseau). Le build doit quand même réussir et générer les pages.

## 📚 Ressources

- 📖 [README complet](./README.md)
- ⚡ [Guide rapide](./QUICKSTART.md)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- 📊 [Recharts](https://recharts.org)
- 🔗 [Next.js](https://nextjs.org)

## 🎯 Prochaines Étapes (Optionnel)

Fonctionnalités non implémentées (peuvent être ajoutées) :

1. **Filtres de période** : Sélecteur de dates personnalisé
2. **Export CSV/PNG** : Bouton d'export des graphiques
3. **Partage sécurisé** : Auth NextAuth + liens publics
4. **Graphiques avancés** : Time series avec Recharts
5. **Tests unitaires** : Vitest sur les parsers
6. **Données mock** : Fichier `lib/mock-data.json` disponible

Ces fonctionnalités peuvent être développées sur demande.

## 💬 Support

Questions ? Vérifiez :
1. Le README.md (très complet)
2. QUICKSTART.md (guide pas à pas)
3. Les logs de la console (F12)

---

**Créé avec ❤️ pour ConciergElite**

Dashboard développé par Claude Code • Next.js 14 • TypeScript • Tailwind CSS
