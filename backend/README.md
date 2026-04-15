# TranspoBot - Backend API

Backend API pour la gestion de transport urbain avec assistant IA conversationnel.

## Technologies

- Node.js
- Express
- MySQL 8.x
- OpenAI API (gpt-4o-mini)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

Éditer `.env` et ajouter vos configurations :
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- OPENAI_API_KEY

3. Importer le schéma de base de données :
```bash
mysql -u root -p transpobot < ../schema.sql
```

## Démarrage

En développement :
```bash
npm run dev
```

En production :
```bash
npm start
```

## Endpoints API

- `GET /api` - Information sur l'API
- `GET /api/vehicules` - Liste des véhicules
- `GET /api/chauffeurs` - Liste des chauffeurs
- `GET /api/trajets` - Liste des trajets
- `GET /api/incidents` - Liste des incidents
- `GET /api/lignes` - Liste des lignes
- `GET /api/tarifs` - Liste des tarifs
- `GET /api/dashboard` - KPIs du tableau de bord
- `POST /api/chat` - Chat avec l'IA (Text-to-SQL)

## Sécurité

- Seules les requêtes SELECT sont autorisées via le chatbot
- Validation des entrées
- CORS configuré
