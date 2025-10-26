/**
 * Google Apps Script - Webhook pour revalidation automatique
 *
 * INSTALLATION:
 * 1. Ouvrir votre Google Sheet
 * 2. Extensions → Apps Script
 * 3. Copier-coller ce code
 * 4. Remplacer WEBHOOK_URL et SECRET par vos valeurs
 * 5. Sauvegarder (Ctrl+S)
 * 6. Configurer le trigger:
 *    - Cliquer sur l'icône d'horloge (Triggers)
 *    - Add Trigger
 *    - Function: onEdit
 *    - Event type: On edit
 *    - Save
 */

// ⚠️ CONFIGURATION - À MODIFIER ⚠️
const WEBHOOK_URL = 'https://votre-domaine.vercel.app/api/revalidate';
const SECRET = 'votre_secret_ici'; // Doit correspondre à REVALIDATE_SECRET dans .env.local

/**
 * Fonction appelée automatiquement quand une cellule est modifiée
 */
function onEdit(e) {
  try {
    // Vérifier que l'événement est valide
    if (!e || !e.range) {
      Logger.log('Événement onEdit invalide');
      return;
    }

    // Récupérer des infos sur la modification
    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();
    const range = e.range.getA1Notation();
    const value = e.value;

    Logger.log(`Modification détectée - Onglet: ${sheetName}, Cellule: ${range}, Valeur: ${value}`);

    // Optionnel: ne trigger que pour certains onglets
    // if (sheetName !== 'OCTOBRE') {
    //   Logger.log('Onglet ignoré');
    //   return;
    // }

    // Appeler le webhook
    const payload = {
      timestamp: new Date().toISOString(),
      sheetName: sheetName,
      range: range,
      value: value,
    };

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET}`,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true, // Ne pas throw d'erreur sur échec HTTP
    };

    Logger.log(`Envoi webhook à ${WEBHOOK_URL}`);
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log(`Réponse webhook: ${responseCode} - ${responseText}`);

    if (responseCode !== 200) {
      Logger.log(`⚠️ Erreur webhook: ${responseCode}`);
    } else {
      Logger.log('✅ Webhook envoyé avec succès');
    }

  } catch (error) {
    Logger.log(`❌ Erreur dans onEdit: ${error.toString()}`);
  }
}

/**
 * Fonction de test manuel (optionnel)
 * Pour tester sans modifier le Sheet:
 * 1. Exécuter cette fonction depuis l'éditeur Apps Script
 * 2. Vérifier les logs (View → Logs)
 */
function testWebhook() {
  Logger.log('🧪 Test manuel du webhook...');

  const payload = {
    timestamp: new Date().toISOString(),
    test: true,
    message: 'Test manuel depuis Apps Script',
  };

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log(`Réponse: ${responseCode}`);
    Logger.log(`Body: ${responseText}`);

    if (responseCode === 200) {
      Logger.log('✅ Test réussi !');
    } else {
      Logger.log(`⚠️ Erreur: ${responseCode}`);
    }
  } catch (error) {
    Logger.log(`❌ Erreur: ${error.toString()}`);
  }
}

/**
 * Menu personnalisé (optionnel)
 * Ajoute un menu dans Google Sheets pour tester le webhook
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Dashboard')
    .addItem('🔄 Forcer la synchronisation', 'testWebhook')
    .addToUi();
}
