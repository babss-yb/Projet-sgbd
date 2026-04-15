const mysql = require('mysql2/promise');

// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'transpobot',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion (non bloquant)
let dbConnected = false;
pool.getConnection()
  .then(connection => {
    console.log('✅ Connexion à la base de données MySQL réussie');
    dbConnected = true;
    connection.release();
  })
  .catch(error => {
    console.error('⚠️  Erreur de connexion à la base de données:', error.message);
    console.error('⚠️  Le serveur démarrera mais les requêtes échoueront.');
    console.error('⚠️  Vérifiez que MySQL est installé et que la base transpobot existe.');
  });

module.exports = pool;
module.exports.isConnected = () => dbConnected;
