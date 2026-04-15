const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET toutes les lignes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lignes ORDER BY code');
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lignes' });
  }
});

// GET une ligne par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lignes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ligne non trouvée' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la ligne' });
  }
});

module.exports = router;
