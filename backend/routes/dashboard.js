const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET KPIs du tableau de bord
router.get('/', async (req, res) => {
  try {
    // Exécuter toutes les requêtes en parallèle
    const [
      [vehiculesStats],
      [chauffeursStats],
      [trajetsStats],
      [incidentsStats],
      [trajetsSemaine],
      [incidentsMois]
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN statut = "actif" THEN 1 ELSE 0 END) as actifs, SUM(CASE WHEN statut = "maintenance" THEN 1 ELSE 0 END) as maintenance FROM vehicules'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN statut = "actif" THEN 1 ELSE 0 END) as actifs FROM chauffeurs'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN statut = "termine" THEN 1 ELSE 0 END) as termines, SUM(CASE WHEN statut = "en_cours" THEN 1 ELSE 0 END) as en_cours FROM trajets'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN resolu = 0 THEN 1 ELSE 0 END) as non_resolus FROM incidents'),
      db.query('SELECT COUNT(*) as count FROM trajets WHERE date_heure_depart >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND statut = "termine"'),
      db.query('SELECT COUNT(*) as count FROM incidents WHERE MONTH(date_incident) = MONTH(NOW())')
    ]);

    res.json({
      vehicules: {
        total: vehiculesStats[0].total,
        actifs: vehiculesStats[0].actifs,
        maintenance: vehiculesStats[0].maintenance
      },
      chauffeurs: {
        total: chauffeursStats[0].total,
        actifs: chauffeursStats[0].actifs
      },
      trajets: {
        total: trajetsStats[0].total,
        termines: trajetsStats[0].termines,
        en_cours: trajetsStats[0].en_cours,
        cette_semaine: trajetsSemaine[0].count
      },
      incidents: {
        total: incidentsStats[0].total,
        non_resolus: incidentsStats[0].non_resolus,
        ce_mois: incidentsMois[0].count
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des KPIs' });
  }
});

module.exports = router;
