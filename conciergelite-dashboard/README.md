# ConciergElite Dashboard 📊

Dashboard interactif et moderne pour suivre en temps réel les KPIs d'acquisition et de vente de ConciergElite, synchronisé avec Google Sheets.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

- **📊 KPIs en temps réel** : Synchronisation automatique avec Google Sheets
- **💡 Quick Wins intelligents** : Recommandations automatiques basées sur vos métriques
- **🎨 Interface moderne** : Design élégant avec animations fluides et dark mode
- **📈 Graphiques interactifs** : Visualisation claire de vos données avec Recharts
- **⚡ Performance optimale** : ISR + cache avec revalidation webhook
- **🎯 Quick Wins priorisés** : Recommandations HIGH/MEDIUM/LOW avec actions concrètes
- **🌙 Dark mode** : Thème sombre/clair avec persistance
- **📱 Responsive** : Fonctionne sur mobile, tablette et desktop

## 🚀 Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript 5
- **Styling** : Tailwind CSS 3 + shadcn/ui
- **Animations** : Framer Motion
- **Graphiques** : Recharts
- **API** : Google Sheets API (Service Account)
- **Deployment** : Vercel (recommandé)

## 📋 Prérequis

- Node.js 18+ et pnpm
- Un compte Google Cloud Platform
- Un Google Sheet avec vos données KPIs

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd conciergelite-dashboard
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration Google Cloud

#### 3.1 Créer un Service Account

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google Sheets :
   - APIs & Services → Library
   - Rechercher "Google Sheets API"
   - Cliquer sur "Enable"

4. Créer un Service Account :
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Nommer le compte (ex: "sheet-reader")
   - Cliquer sur "Create and Continue"
   - Rôle : "Viewer" (lecture seule)
   - Cliquer sur "Done"

5. Créer une clé JSON :
   - Cliquer sur le Service Account créé
   - Keys → Add Key → Create new key
   - Type: JSON
   - Télécharger le fichier JSON

#### 3.2 Partager votre Google Sheet

1. Ouvrir votre Google Sheet
2. Cliquer sur "Partager"
3. Ajouter l'email du Service Account (ex: `sheet-reader@votre-projet.iam.gserviceaccount.com`)
4. Permissions : **Lecteur** (read-only)
5. Récupérer l'ID du Sheet dans l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### 4. Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
cp .env.example .env.local
```

Éditer `.env.local` :

```env
# ID du Google Sheet (dans l'URL)
GOOGLE_SHEET_ID=votre_spreadsheet_id_ici

# Range à lire (onglet + plage)
GOOGLE_SHEET_RANGE=OCTOBRE!A1:AB100

# Nom de l'onglet
GOOGLE_SHEET_NAME=OCTOBRE

# Contenu du fichier JSON du Service Account (tout sur une ligne)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Secret pour le webhook (générer avec: openssl rand -base64 32)
REVALIDATE_SECRET=votre_secret_aleatoire
```

### 5. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📊 Structure des données du Google Sheet

Le dashboard s'attend à trouver les colonnes suivantes dans votre Sheet (onglet OCTOBRE) :

### En-têtes obligatoires :

| Colonne | Description |
|---------|-------------|
| `Stat de la semaine du` | Date de début de semaine |
| `Spend` | Dépenses publicitaires |
| `Impr` | Impressions |
| `CPM` | Coût pour mille |
| `Clics` | Nombre de clics |
| `CPC` | Coût par clic |
| `CTR` | Click-through rate |
| `Hook Rate` | Taux d'accroche vidéo |
| `VCR 10%`, `VCR 30%`, `VCR 50%`, `VCR 100%` | Video completion rates |
| `Nbr De Surveys` | Nombre de formulaires |
| `Cout Par Surveys` | CPL |
| `Nbr de Call Réalisé` | Appels réalisés |
| `Nbr Calls disqualif` | Appels disqualifiés |
| `Cout Par Call` | Coût par appel |
| `LPC Calls/Clics` | Conversion clics → appels |
| `SUR` | Survey completion rate |
| `Taux de Qualif` | Taux de qualification |
| `tr 3J Calendrier` | Taux de RDV tenus 3j |
| `Taux de Conv` | Taux de conversion |
| `Closer Status Good?` | Statut closer |
| `SALES N` | Nombre de ventes |
| `VOL D'affaire` | Volume d'affaires |
| `CASH COLLECTE` | Cash collecté |
| `ROAS VA` | ROAS volume |
| `ROAS CASH` | ROAS cash |

**Note** : Les noms de colonnes ne sont pas sensibles à la casse. Le parser gère automatiquement :
- Les espaces dans les nombres : `"1 700"` → `1700`
- Les virgules décimales : `"1,5"` → `1.5`
- Les pourcentages : `"23%"` → `0.23`

## 🔄 Mise à jour en temps réel

### Option 1 : Webhook Google Apps Script (recommandé)

Ajouter ce script à votre Google Sheet (Extensions → Apps Script) :

```javascript
/**
 * Webhook pour notifier le dashboard lors de modifications
 */
function onEdit(e) {
  const WEBHOOK_URL = 'https://votre-domaine.vercel.app/api/revalidate';
  const SECRET = 'votre_secret_ici';

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SECRET}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      timestamp: new Date().toISOString(),
      range: e.range.getA1Notation()
    })
  };

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch (error) {
    console.error('Erreur webhook:', error);
  }
}
```

**Déploiement** :
1. Sauvegarder le script
2. Triggers → Add Trigger
3. Function : `onEdit`
4. Event type : On edit
5. Sauvegarder

### Option 2 : Polling automatique

Le dashboard revalide automatiquement les données toutes les 60 secondes (configurable dans `app/page.tsx` avec `export const revalidate = 60`).

## 💡 Quick Wins

Le moteur de Quick Wins analyse automatiquement vos KPIs et génère des recommandations priorisées :

### Règles implémentées :

- **CREA** : CTR faible, Hook Rate faible, VCR problématiques
- **MEDIA** : CPC élevé, CPM élevé, impressions en baisse
- **FUNNEL** : CPL élevé, taux de qualif faible, no-show élevé
- **SALES** : Taux de conv faible, ROAS faible, ticket moyen en baisse

Chaque Quick Win inclut :
- ✅ **Titre** : Problème identifié
- 📊 **Raison** : Métriques chiffrées
- 🎯 **Action** : Étapes concrètes
- 📈 **Impact** : Amélioration attendue
- 🏷️ **Priorité** : HIGH / MEDIUM / LOW

## 🎨 Personnalisation

### Couleurs (Tailwind)

Les couleurs ConciergElite sont définies dans `tailwind.config.ts` :

```typescript
colors: {
  concierge: {
    yellow: '#FED51F',      // Jaune principal
    'yellow-dark': '#E5C01C', // Variant sombre
  }
}
```

### Thème (CSS Variables)

Modifier les variables dans `app/globals.css` :

```css
:root {
  --primary: 47 98% 56%; /* #FED51F */
  --radius: 1rem; /* Border radius */
}
```

## 📦 Build & Déploiement

### Build local

```bash
pnpm build
pnpm start
```

### Déploiement Vercel (recommandé)

1. Push votre code sur GitHub
2. Connecter votre repo à [Vercel](https://vercel.com)
3. Ajouter les variables d'environnement dans Vercel :
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEET_RANGE`
   - `GOOGLE_SHEET_NAME`
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `REVALIDATE_SECRET`

4. Déployer !

**⚠️ Important** : Ne jamais commit le fichier `.env.local` (déjà dans `.gitignore`).

## 🧪 Tests

Lancer les tests unitaires :

```bash
pnpm test
```

## 🐛 Dépannage

### Erreur "GOOGLE_SERVICE_ACCOUNT_KEY n'est pas défini"

- Vérifier que `.env.local` existe et contient la clé JSON
- Le JSON doit être sur **une seule ligne** et échappé correctement

### Aucune donnée n'apparaît

1. Vérifier que le Sheet est bien partagé avec le Service Account
2. Vérifier l'ID du Sheet dans `.env.local`
3. Vérifier le range (ex: `OCTOBRE!A1:AB100`)
4. Ouvrir la console du navigateur pour voir les erreurs

### Le webhook ne fonctionne pas

1. Vérifier que `REVALIDATE_SECRET` est identique dans `.env.local` et Apps Script
2. Tester manuellement : `curl -X POST https://votre-domaine.vercel.app/api/revalidate?secret=votre_secret`

## 📚 Documentation

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

## 🤝 Contribution

Les contributions sont les bienvenues ! Ouvrir une issue ou une pull request.

## 📄 Licence

MIT © ConciergElite

---

**Développé avec ❤️ par l'équipe ConciergElite**
