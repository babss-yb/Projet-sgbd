const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET tous les incidents
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, t.date_heure_depart, v.immatriculation, CONCAT(c.nom, ' ', c.prenom) AS chauffeur
      FROM incidents i
      JOIN trajets t ON i.trajet_id = t.id
      JOIN vehicules v ON t.vehicule_id = v.id
      JOIN chauffeurs c ON t.chauffeur_id = c.id
      ORDER BY i.date_incident DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents' });
  }
});

// GET incidents par statut de résolution (doit être avant /:id)
router.get('/resolu/:resolu', async (req, res) => {
  try {
    const resolu = req.params.resolu === 'true' ? 1 : 0;
    const [rows] = await db.query(`
      SELECT i.*, t.date_heure_depart, v.immatriculation, CONCAT(c.nom, ' ', c.prenom) AS chauffeur
      FROM incidents i
      JOIN trajets t ON i.trajet_id = t.id
      JOIN vehicules v ON t.vehicule_id = v.id
      JOIN chauffeurs c ON t.chauffeur_id = c.id
      WHERE i.resolu = ?
      ORDER BY i.date_incident DESC
    `, [resolu]);
    res.json(rows);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents' });
  }
});

// GET un incident par ID (doit être après les routes spécifiques)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, t.date_heure_depart, v.immatriculation, CONCAT(c.nom, ' ', c.prenom) AS chauffeur
      FROM incidents i
      JOIN trajets t ON i.trajet_id = t.id
      JOIN vehicules v ON t.vehicule_id = v.id
      JOIN chauffeurs c ON t.chauffeur_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Incident non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'incident' });
  }
});

module.exports = router;
