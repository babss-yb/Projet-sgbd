# Architecture Technique - TranspoBot

## Vue d'ensemble

TranspoBot est une application web fullstack composée de :
- Un backend API REST (Node.js Express)
- Une base de données MySQL
- Un frontend React
- Une intégration avec OpenAI API pour l'assistant conversationnel

```
┌─────────────────────────────────────────────────────────────┐
│                        Utilisateur                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend React                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Data Views  │  │  Chat IA     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Node.js Express                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes API                                           │  │
│  │  - /api/vehicules                                     │  │
│  │  - /api/chauffeurs                                    │  │
│  │  - /api/trajets                                       │  │
│  │  - /api/incidents                                     │  │
│  │  - /api/lignes                                        │  │
│  │  - /api/tarifs                                        │  │
│  │  - /api/dashboard                                     │  │
│  │  - /api/chat (Text-to-SQL)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │  Services                                             │  │
│  │  - Database Connection (MySQL)                        │  │
│  │  - OpenAI Integration (gpt-4o-mini)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────┬────────────────────────────────────┬─────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐         ┌──────────────────────────┐
│    MySQL Database    │         │    OpenAI API            │
│  - vehicules         │         │  - gpt-4o-mini           │
│  - chauffeurs        │         │  - Text-to-SQL           │
│  - lignes            │         │  - Prompt Engineering    │
│  - tarifs            │         └──────────────────────────┘
│  - trajets           │
│  - incidents         │
└──────────────────────┘
```

## Stack Technique

### Frontend
- **Framework** : React 18.2.0
- **HTTP Client** : Axios
- **Icônes** : Lucide React
- **Build Tool** : Create React App

### Backend
- **Runtime** : Node.js
- **Framework** : Express 4.18.2
- **Database Driver** : MySQL2 3.6.5
- **Environment Variables** : dotenv
- **CORS** : cors 2.8.5
- **LLM Integration** : OpenAI SDK 4.20.1

### Base de données
- **SGBD** : MySQL 8.x
- **Moteur** : InnoDB
- **Charset** : utf8mb4_unicode_ci

### Intelligence Artificielle
- **Provider** : OpenAI
- **Modèle** : gpt-4o-mini
- **Fonction** : Text-to-SQL (génération de requêtes SQL)

## Structure des dossiers

```
transpobot/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration MySQL
│   ├── routes/
│   │   ├── vehicules.js         # Routes véhicules
│   │   ├── chauffeurs.js        # Routes chauffeurs
│   │   ├── trajets.js           # Routes trajets
│   │   ├── incidents.js         # Routes incidents
│   │   ├── lignes.js            # Routes lignes
│   │   ├── tarifs.js            # Routes tarifs
│   │   ├── dashboard.js         # Routes KPIs
│   │   └── chat.js              # Route IA (Text-to-SQL)
│   ├── server.js                # Point d'entrée serveur
│   ├── package.json             # Dépendances backend
│   ├── .env.example             # Exemple variables environnement
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Composant tableau de bord
│   │   │   ├── DataViews.js     # Composant vues de données
│   │   │   └── Chat.js          # Composant chat IA
│   │   ├── App.js               # Composant principal
│   │   ├── App.css
│   │   ├── index.js             # Point d'entrée React
│   │   └── index.css
│   ├── package.json             # Dépendances frontend
│   └── .gitignore
├── schema.sql                   # Script SQL de création
├── rapport/
│   ├── dictionnaire_donnees.md  # Dictionnaire de données
│   ├── MCD.md                   # Modèle Conceptuel de Données
│   ├── MLD.md                   # Modèle Logique de Données
│   └── architecture_technique.md
└── README.md                    # Documentation principale
```

## Flux de données

### 1. Consultation des données (Dashboard/DataViews)

```
Utilisateur → React Component → Axios → API REST → MySQL → Résultats → React → Affichage
```

### 2. Chat avec l'IA (Text-to-SQL)

```
Utilisateur → Chat Component → Axios → /api/chat
    ↓
OpenAI API (gpt-4o-mini)
    ↓
Génération SQL sécurisé (SELECT uniquement)
    ↓
Exécution SQL sur MySQL
    ↓
Résultats + Explication naturelle
    ↓
React → Affichage (SQL, résultats, réponse)
```

## Sécurité

### Backend
- **CORS** : Configuration pour autoriser le frontend
- **Validation** : Validation des entrées utilisateur
- **SQL Injection** : Utilisation de requêtes paramétrées (MySQL2)
- **Prompt Engineering** : Prompt système sécurisé limité aux SELECT

### Frontend
- **Pas de stockage de données sensibles** côté client
- **Communication via HTTPS** en production

### OpenAI Integration
- **Prompt sécurisé** : Interdiction explicite des requêtes de modification
- **Validation** : Vérification que le SQL généré commence par SELECT
- **API Key** : Stockée dans les variables d'environnement

## Déploiement

### Plateforme recommandée : Render

**Architecture de déploiement :**

1. **Base de données MySQL** (Render Database)
   - Instance MySQL dédiée
   - Configuration des variables d'environnement

2. **Backend API** (Render Web Service)
   - Node.js Express
   - Variables d'environnement pour DB et OpenAI
   - Auto-scaling

3. **Frontend React** (Render Static Site)
   - Build statique
   - Déployé sur CDN
   - Communication avec backend via API

**Variables d'environnement Render :**
```
DB_HOST=xxx.render.com
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=transpobot
OPENAI_API_KEY=sk-xxx
```

## Performance

### Optimisations Backend
- **Connection Pooling** : MySQL2 pool de connexions
- **Indexation** : Index sur les clés étrangères et champs fréquemment recherchés
- **Vues** : Vues pré-calculées pour les requêtes complexes

### Optimisations Frontend
- **Lazy Loading** : Chargement à la demande des données
- **Pagination** : Limitation des résultats (50 trajets max)
- **React Hooks** : Optimisation des re-rendus

## Scalabilité

### Évolutivité horizontale
- Backend stateless (peut être multi-instance)
- Frontend statique (CDN)
- Base de données : possibilité de réplication

### Évolutivité verticale
- Upgrade des instances Render
- Augmentation de la taille de la base de données
