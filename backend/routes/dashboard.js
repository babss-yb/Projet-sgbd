const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET KPIs du tableau de bord
router.get('/', async (req, res) => {
  try {
    // Exécuter toutes les requêtes en parallèle
    const [
      vehiculesResult,
      chauffeursResult,
      trajetsResult,
      incidentsResult,
      trajetsSemaineResult,
      incidentsMoisResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN statut = "actif" THEN 1 ELSE 0 END), 0) as actifs, COALESCE(SUM(CASE WHEN statut = "maintenance" THEN 1 ELSE 0 END), 0) as maintenance FROM vehicules'),
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN statut = "actif" THEN 1 ELSE 0 END), 0) as actifs FROM chauffeurs'),
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN statut = "termine" THEN 1 ELSE 0 END), 0) as termines, COALESCE(SUM(CASE WHEN statut = "en_cours" THEN 1 ELSE 0 END), 0) as en_cours FROM trajets'),
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN resolu = 0 THEN 1 ELSE 0 END), 0) as non_resolus FROM incidents'),
      db.query('SELECT COUNT(*) as count FROM trajets WHERE date_heure_depart >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND statut = "termine"'),
      db.query('SELECT COUNT(*) as count FROM incidents WHERE MONTH(date_incident) = MONTH(NOW())')
    ]);

    // mysql2/promise returns [rows, fields], so we need to destructure correctly
    const [vehiculesRows] = vehiculesResult;
    const [chauffeursRows] = chauffeursResult;
    const [trajetsRows] = trajetsResult;
    const [incidentsRows] = incidentsResult;
    const [trajetsSemaineRows] = trajetsSemaineResult;
    const [incidentsMoisRows] = incidentsMoisResult;

    const vehiculesStats = vehiculesRows[0];
    const chauffeursStats = chauffeursRows[0];
    const trajetsStats = trajetsRows[0];
    const incidentsStats = incidentsRows[0];
    const trajetsSemaine = trajetsSemaineRows[0];
    const incidentsMois = incidentsMoisRows[0];

    res.json({
      vehicules: {
        total: parseInt(vehiculesStats.total),
        actifs: parseInt(vehiculesStats.actifs),
        maintenance: parseInt(vehiculesStats.maintenance)
      },
      chauffeurs: {
        total: parseInt(chauffeursStats.total),
        actifs: parseInt(chauffeursStats.actifs)
      },
      trajets: {
        total: parseInt(trajetsStats.total),
        termines: parseInt(trajetsStats.termines),
        en_cours: parseInt(trajetsStats.en_cours),
        cette_semaine: parseInt(trajetsSemaine.count)
      },
      incidents: {
        total: parseInt(incidentsStats.total),
        non_resolus: parseInt(incidentsStats.non_resolus),
        ce_mois: parseInt(incidentsMois.count)
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des KPIs' });
  }
});

module.exports = router;
