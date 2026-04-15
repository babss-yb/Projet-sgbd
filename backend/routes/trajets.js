const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET tous les trajets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_trajets_recents ORDER BY date_heure_depart DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des trajets' });
  }
});

// GET trajets par statut (doit être avant /:id)
router.get('/statut/:statut', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_trajets_recents WHERE statut = ? ORDER BY date_heure_depart DESC', [req.params.statut]);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des trajets' });
  }
});

// GET trajets récents (7 derniers jours) (doit être avant /:id)
router.get('/recents/jours/:jours', async (req, res) => {
  try {
    const jours = req.params.jours || 7;
    const [rows] = await db.query(
      'SELECT * FROM v_trajets_recents WHERE date_heure_depart >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY date_heure_depart DESC',
      [jours]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des trajets' });
  }
});

// GET un trajet par ID (doit être après les routes spécifiques)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_trajets_recents WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du trajet' });
  }
});

module.exports = router;
