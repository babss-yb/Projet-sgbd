const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET tous les chauffeurs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chauffeurs ORDER BY nom, prenom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des chauffeurs' });
  }
});

// GET chauffeurs par statut (doit être avant /:id)
router.get('/statut/:statut', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chauffeurs WHERE statut = ?', [req.params.statut]);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des chauffeurs' });
  }
});

// GET un chauffeur par ID (doit être après les routes spécifiques)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chauffeurs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du chauffeur' });
  }
});

module.exports = router;
