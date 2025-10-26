# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de lancer le dashboard ConciergElite en **moins de 10 minutes**.

## ⚡ Installation Express

### 1. Prérequis
- ✅ Node.js 18+ installé
- ✅ pnpm installé (`npm install -g pnpm`)
- ✅ Un Google Sheet avec vos données
- ✅ Accès à Google Cloud Console

### 2. Installation

```bash
# Cloner et installer
cd conciergelite-dashboard
pnpm install
```

### 3. Configuration Google Sheets (5 min)

#### A. Créer le Service Account

1. Aller sur https://console.cloud.google.com
2. Créer un projet "conciergelite-dashboard"
3. Activer "Google Sheets API"
4. Créer un Service Account:
   - IAM & Admin → Service Accounts → Create
   - Nom: `sheet-reader`
   - Rôle: Viewer
5. Créer une clé JSON:
   - Service Account → Keys → Add Key → JSON
   - Télécharger le fichier

#### B. Partager votre Google Sheet

1. Ouvrir votre Google Sheet
2. Cliquer "Partager"
3. Coller l'email du Service Account (ex: `sheet-reader@conciergelite-dashboard.iam.gserviceaccount.com`)
4. Permission: **Lecteur**

#### C. Récupérer l'ID du Sheet

Dans l'URL de votre Sheet:
```
https://docs.google.com/spreadsheets/d/[COPIEZ_CETTE_PARTIE]/edit
                                       ^^^^^^^^^^^^^^^^^^^
                                       C'est votre SHEET_ID
```

### 4. Configuration Environnement

Créer `.env.local` à la racine:

```bash
# Remplacer par vos vraies valeurs
GOOGLE_SHEET_ID=1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA
GOOGLE_SHEET_RANGE=OCTOBRE!A1:AB100
GOOGLE_SHEET_NAME=OCTOBRE
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
REVALIDATE_SECRET=mon_secret_aleatoire
```

**⚠️ Important**: Le `GOOGLE_SERVICE_ACCOUNT_KEY` doit être le contenu COMPLET du fichier JSON téléchargé, sur UNE SEULE ligne.

### 5. Lancer le Dashboard

```bash
pnpm dev
```

Ouvrir http://localhost:3000 🎉

---

## ✅ Checklist de Vérification

Avant de déployer en production, vérifiez:

- [ ] Le dashboard affiche des données
- [ ] Les Quick Wins apparaissent
- [ ] Le dark mode fonctionne
- [ ] Toutes les pages se chargent (/, /acquisition, /pipeline, /sales, /settings)
- [ ] Les deltas (vs semaine précédente) s'affichent correctement

---

## 🔄 Configuration du Webhook (Optionnel)

Pour des mises à jour **instantanées** quand le Sheet change:

1. Ouvrir votre Google Sheet
2. Extensions → Apps Script
3. Copier-coller le code de `google-apps-script.js`
4. Remplacer `WEBHOOK_URL` et `SECRET`
5. Sauvegarder
6. Triggers (icône horloge) → Add Trigger:
   - Function: `onEdit`
   - Event: On edit
   - Save

---

## 🚀 Déploiement Vercel (5 min)

1. Push votre code sur GitHub
2. Aller sur https://vercel.com
3. Import Repository
4. Ajouter les variables d'environnement:
   ```
   GOOGLE_SHEET_ID=...
   GOOGLE_SHEET_RANGE=OCTOBRE!A1:AB100
   GOOGLE_SHEET_NAME=OCTOBRE
   GOOGLE_SERVICE_ACCOUNT_KEY={...}
   REVALIDATE_SECRET=...
   ```
5. Deploy!

---

## 🐛 Problèmes Fréquents

### "Aucune donnée disponible"

**Causes possibles:**
1. Sheet ID incorrect dans `.env.local`
2. Service Account pas partagé sur le Sheet
3. Range incorrect (vérifier le nom de l'onglet)

**Solution:**
```bash
# Tester la connexion
node -e "require('./lib/google-sheets').getKpiData().then(console.log)"
```

### "Erreur d'authentification"

**Cause:** JSON du Service Account mal formaté

**Solution:** Vérifier que le JSON est bien sur une ligne et correctement échappé.

### Le webhook ne fonctionne pas

**Solution:** Tester manuellement:
```bash
curl -X POST "https://votre-domaine.vercel.app/api/revalidate?secret=votre_secret"
```

---

## 📚 Ressources

- 📖 [README complet](./README.md)
- 🔧 [Configuration détaillée](./README.md#-installation)
- 💡 [Quick Wins - Règles](./lib/quick-wins.ts)
- 🎨 [Personnalisation](./README.md#-personnalisation)

---

## 💬 Support

En cas de problème:
1. Vérifier les logs de la console navigateur (F12)
2. Vérifier les logs du serveur (`pnpm dev`)
3. Vérifier que toutes les variables d'environnement sont définies

---

**Bon dashboard! 🚀📊**
