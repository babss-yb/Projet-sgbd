require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vehicules', require('./routes/vehicules'));
app.use('/api/chauffeurs', require('./routes/chauffeurs'));
app.use('/api/trajets', require('./routes/trajets'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/lignes', require('./routes/lignes'));
app.use('/api/tarifs', require('./routes/tarifs'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/chat', require('./routes/chat'));

// Route de test
app.get('/api', (req, res) => {
  res.json({ 
    message: 'TranspoBot API - Gestion de Transport Urbain avec IA',
    version: '1.0.0',
    endpoints: {
      vehicules: '/api/vehicules',
      chauffeurs: '/api/chauffeurs',
      trajets: '/api/trajets',
      incidents: '/api/incidents',
      lignes: '/api/lignes',
      tarifs: '/api/tarifs',
      dashboard: '/api/dashboard',
      chat: '/api/chat'
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrage du serveur avec recherche automatique de port libre
const PORT = parseInt(process.env.PORT) || 3000;
const MAX_PORT_ATTEMPTS = 10;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Serveur TranspoBot démarré sur le port ${port}`);
    console.log(`📊 API disponible sur http://localhost:${port}/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      if (nextPort < PORT + MAX_PORT_ATTEMPTS) {
        console.log(`⚠️  Port ${port} occupé, essai sur le port ${nextPort}...`);
        startServer(nextPort);
      } else {
        console.error(`❌ Impossible de trouver un port libre entre ${PORT} et ${PORT + MAX_PORT_ATTEMPTS - 1}`);
        console.error(`💡 Essayez de changer le port dans .env ou de tuer les processus sur ces ports`);
        process.exit(1);
      }
    } else {
      console.error('Erreur serveur:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);

module.exports = app;
