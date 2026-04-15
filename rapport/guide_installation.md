# Guide d'Installation et de Déploiement - TranspoBot

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL 8.x
- npm ou yarn
- Une clé API OpenAI (https://platform.openai.com/api-keys)

## Installation Locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/transpobot.git
cd transpobot
```

### 2. Configurer la base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE transpobot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importer le schéma
USE transpobot;
SOURCE schema.sql;

# Quitter MySQL
EXIT;
```

### 3. Configurer le backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=transpobot
DB_PORT=3306

OPENAI_API_KEY=sk-votre-cle-openai
OPENAI_MODEL=gpt-4o-mini

PORT=3000
NODE_ENV=development
```

### 4. Démarrer le backend

```bash
# En développement
npm run dev

# En production
npm start
```

Le backend sera accessible sur http://localhost:3000

### 5. Configurer le frontend

```bash
cd ../frontend

# Installer les dépendances
npm install
```

### 6. Démarrer le frontend

```bash
npm start
```

Le frontend sera accessible sur http://localhost:3000 (React)

## Déploiement sur Render

### 1. Préparer le dépôt GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/transpobot.git
git push -u origin main
```

### 2. Déployer la base de données MySQL

1. Aller sur https://dashboard.render.com
2. Cliquer sur "New+" → "Database"
3. Choisir "MySQL"
4. Nommer la base de données "transpobot-db"
5. Cliquer sur "Create Database"

Une fois créée, récupérer les informations de connexion :
- Internal Database URL
- External Database URL
- Username
- Password
- Database Name

### 3. Déployer le backend

1. Sur Render, cliquer sur "New+" → "Web Service"
2. Connecter le dépôt GitHub
3. Configurer :
   - **Name** : transpobot-backend
   - **Region** : Europe (ou la plus proche)
   - **Branch** : main
   - **Root Directory** : backend
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
4. Ajouter les variables d'environnement :
   ```
   DB_HOST=xxx.render.com
   DB_USER=xxx
   DB_PASSWORD=xxx
   DB_NAME=transpobot
   DB_PORT=3306
   OPENAI_API_KEY=sk-xxx
   OPENAI_MODEL=gpt-4o-mini
   PORT=3000
   NODE_ENV=production
   ```
5. Cliquer sur "Create Web Service"

### 4. Déployer le frontend

1. Sur Render, cliquer sur "New+" → "Static Site"
2. Connecter le dépôt GitHub
3. Configurer :
   - **Name** : transpobot-frontend
   - **Region** : Europe (ou la plus proche)
   - **Branch** : main
   - **Root Directory** : frontend
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : build
4. Ajouter les variables d'environnement :
   ```
   REACT_APP_API_URL=https://transpobot-backend.onrender.com/api
   ```
5. Cliquer sur "Create Static Site"

### 5. Mettre à jour le frontend pour la production

Modifier `frontend/src/components/Dashboard.js`, `DataViews.js` et `Chat.js` :

```javascript
// Remplacer
const [apiUrl, setApiUrl] = useState('http://localhost:3000/api');

// Par
const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'http://localhost:3000/api');
```

### 6. Redéployer

Pusher les modifications et Render redéploiera automatiquement.

## Vérification du déploiement

1. Tester l'API backend :
   ```
   curl https://transpobot-backend.onrender.com/api
   ```

2. Tester le frontend :
   - Ouvrir https://transpobot-frontend.onrender.com
   - Vérifier le tableau de bord
   - Tester le chat IA

## Dépannage

### Problème : Connexion MySQL refusée

**Solution** : Vérifier que :
- Les identifiants dans .env sont corrects
- La base de données est accessible
- Le firewall autorise la connexion

### Problème : Erreur OpenAI API

**Solution** : Vérifier que :
- La clé API est valide
- Le compte a des crédits
- Le modèle spécifié existe

### Problème : CORS errors

**Solution** : Vérifier que :
- Le backend autorise le domaine du frontend
- Les URLs sont correctes dans les variables d'environnement

### Problème : Le chat IA ne génère pas de SQL

**Solution** : Vérifier que :
- La clé API OpenAI est configurée
- Le prompt système est correct
- Le modèle gpt-4o-mini est accessible

## Maintenance

### Mise à jour des dépendances

```bash
# Backend
cd backend
npm update

# Frontend
cd ../frontend
npm update
```

### Sauvegarde de la base de données

```bash
mysqldump -u username -p transpobot > backup_$(date +%Y%m%d).sql
```

### Restauration de la base de données

```bash
mysql -u username -p transpobot < backup_20250413.sql
```

### Surveillance

- Logs du backend : Dashboard Render → Logs
- Logs du frontend : Dashboard Render → Logs
- Base de données : Dashboard Render → Databases → Metrics
