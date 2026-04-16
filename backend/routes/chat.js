const express = require('express');
const router = express.Router();
const db = require('../config/database');
const OpenAI = require('openai');

const llmProvider = (process.env.LLM_PROVIDER || '').toLowerCase();

const defaultBaseUrl = llmProvider === 'xai'
  ? 'https://api.x.ai/v1'
  : llmProvider === 'groq'
    ? 'https://api.groq.com/openai/v1'
    : 'http://localhost:11434/v1';

const defaultModel = llmProvider === 'xai'
  ? 'grok-2-latest'
  : llmProvider === 'groq'
    ? 'llama-3.3-70b-versatile'
    : 'llama3.1';

const openai = new OpenAI({
  apiKey:
    process.env.LLM_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.XAI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    'ollama',
  baseURL: process.env.LLM_BASE_URL || defaultBaseUrl
});

// Schéma de la base de données pour le contexte du LLM
const DATABASE_SCHEMA = `
Tables de la base de données TranspoBot:

1. vehicules (id, immatriculation, marque, modele, type_vehicule, capacite, kilometrage, date_mise_service, statut)
   - statut peut être: 'actif', 'maintenance', 'hors_service', 'en_route'
   - type_vehicule peut être: 'bus', 'minibus', 'taxi', 'van'

2. chauffeurs (id, nom, prenom, telephone, email, date_embauche, permis, statut)
   - statut peut être: 'actif', 'conge', 'suspendu'

3. lignes (id, code, nom, depart, arrivee, distance_km, duree_estimee, statut)
   - statut peut être: 'actif', 'suspendu'

4. tarifs (id, ligne_id, type_ticket, prix, description)
   - type_ticket peut être: 'standard', 'etudiant', 'senior', 'abonnement_mensuel'

5. trajets (id, vehicule_id, chauffeur_id, ligne_id, date_heure_depart, date_heure_arrivee, nombre_passagers, recette, statut)
   - statut peut être: 'planifie', 'en_cours', 'termine', 'annule'
   - date_heure_depart et date_heure_arrivee sont au format DATETIME

6. incidents (id, trajet_id, type_incident, description, gravite, date_incident, resolu, date_resolution)
   - type_incident peut être: 'mecanique', 'accident', 'retard', 'agression', 'panne', 'autre'
   - gravite peut être: 'mineure', 'moyenne', 'majeure'
   - resolu est un BOOLEAN (0 ou 1)

Vues disponibles:
- v_trajets_recents: vue avec détails des trajets (immatriculation, chauffeur, ligne_code, ligne_nom, etc.)
- v_stats_chauffeurs: statistiques par chauffeur (nombre_trajets, total_passagers, total_recette, nombre_incidents)
- v_stats_vehicules: statistiques par véhicule (nombre_trajets, total_passagers, total_recette)

Fonctions MySQL utiles:
- NOW(): date et heure actuelle
- DATE_SUB(NOW(), INTERVAL 7 DAY): il y a 7 jours
- MONTH(NOW()): mois actuel
- YEAR(NOW()): année actuelle
- COUNT(*): compte le nombre de lignes
- SUM(): somme des valeurs
- AVG(): moyenne
- MAX(), MIN(): maximum et minimum
`;

// POST - Chat avec l'IA (Text-to-SQL)
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }

    // Prompt système sécurisé pour le Text-to-SQL
    const systemPrompt = `Tu es un assistant expert en SQL pour une base de données de gestion de transport urbain appelée TranspoBot.

${DATABASE_SCHEMA}

RÈGLES IMPORTANTES:
1. Génère UNIQUEMENT des requêtes SELECT (pas de INSERT, UPDATE, DELETE, DROP, etc.)
2. La requête SQL doit être optimisée et correcte
3. Utilise les vues disponibles quand c'est approprié
4. Réponds en français ou en anglais selon la langue de la question
5. Si la question ne peut pas être répondue avec une requête SQL, explique pourquoi
6. Pour les questions sur "cette semaine", utilise: WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
7. Pour les questions sur "ce mois", utilise: WHERE MONTH(date) = MONTH(NOW())
8. Pour les questions sur "cette année", utilise: WHERE YEAR(date) = YEAR(NOW())

Format de réponse attendu (JSON):
{
  "sql": "SELECT ...",
  "explanation": "Explication en français de la requête",
  "natural_answer": "Réponse naturelle basée sur les résultats"
}

Ne génère que du JSON valide, pas de texte avant ou après.`;

    // Appel au LLM
    const completion = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.3
    });

    const responseContent = completion.choices?.[0]?.message?.content;
    if (!responseContent) {
      return res.status(502).json({
        error: "Réponse LLM vide",
        details: "Le modèle n'a pas renvoyé de contenu"
      });
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(responseContent);
    } catch (parseError) {
      const firstBrace = responseContent.indexOf('{');
      const lastBrace = responseContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const maybeJson = responseContent.slice(firstBrace, lastBrace + 1);
        aiResponse = JSON.parse(maybeJson);
      } else {
        throw parseError;
      }
    }

    // Exécuter la requête SQL générée
    let queryResult = null;
    if (aiResponse.sql) {
      try {
        const [rows] = await db.query(aiResponse.sql);
        queryResult = rows;
        
        // Générer une réponse naturelle basée sur les résultats avec l'IA
        if (rows.length > 0) {
          try {
            const natPrompt = `Question de l'utilisateur : "${message}"\nRésultat SQL : ${JSON.stringify(rows.slice(0, 5))}\n\nFormule uniquement la réponse finale en langage naturel avec précision. Ne donne aucune explication.
Exemples de style attendu :
- "12 trajets terminés cette semaine."
- "Ibrahima FALL avec 2 incidents ce mois."
- "Voici les véhicules en maintenance : DK-9012-EF (78 000 km)."`;
            const natCompletion = await openai.chat.completions.create({
              model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || defaultModel,
              messages: [{ role: 'system', content: 'Tu es un assistant de transport très direct. Réponds brièvement avec les données fournies.' }, { role: 'user', content: natPrompt }],
              temperature: 0.3
            });
            aiResponse.natural_answer = natCompletion.choices[0].message.content.trim();
          } catch (e) {
            aiResponse.natural_answer = generateNaturalAnswer(rows, message);
          }
        } else {
          aiResponse.natural_answer = "Aucun résultat trouvé pour cette requête.";
        }
      } catch (sqlError) {
        console.error('Erreur SQL:', sqlError.message);
        aiResponse.sql_error = sqlError.message;
        aiResponse.natural_answer = "Erreur lors de l'exécution de la requête SQL.";
      }
    }

    res.json({
      user_message: message,
      sql_query: aiResponse.sql,
      explanation: aiResponse.explanation,
      natural_answer: aiResponse.natural_answer,
      results: queryResult,
      sql_error: aiResponse.sql_error || null
    });

  } catch (error) {
    console.error('Erreur LLM:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement de la requête',
      details: error.message 
    });
  }
});

// Fonction utilitaire pour générer une réponse naturelle
function generateNaturalAnswer(results, originalQuestion) {
  if (results.length === 0) {
    return "Aucun résultat trouvé.";
  }

  if (results.length === 1) {
    const row = results[0];
    const keys = Object.keys(row);
    const values = Object.values(row);
    
    if (keys.length === 1 && typeof values[0] === 'number') {
      return `${values[0]}`;
    }
  }

  if (results.length <= 5) {
    return `${results.length} résultat(s) trouvé(s).`;
  }

  return `${results.length} résultats trouvés.`;
}

module.exports = router;
