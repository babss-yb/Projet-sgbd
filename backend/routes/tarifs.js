const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET tous les tarifs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, l.code AS ligne_code, l.nom AS ligne_nom
      FROM tarifs t
      JOIN lignes l ON t.ligne_id = l.id
      ORDER BY l.code, t.type_ticket
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tarifs' });
  }
});

// GET tarifs par ligne
router.get('/ligne/:ligneId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, l.code AS ligne_code, l.nom AS ligne_nom
      FROM tarifs t
      JOIN lignes l ON t.ligne_id = l.id
      WHERE t.ligne_id = ?
    `, [req.params.ligneId]);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tarifs' });
  }
});

module.exports = router;
