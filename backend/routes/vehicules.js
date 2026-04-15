const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET tous les véhicules
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vehicules ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// GET un véhicule par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vehicules WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du véhicule' });
  }
});

// GET véhicules par statut
router.get('/statut/:statut', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vehicules WHERE statut = ?', [req.params.statut]);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

module.exports = router;
