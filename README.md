# TranspoBot - Gestion de Transport Urbain avec IA

Application web de gestion de transport urbain intégrant un assistant conversationnel basé sur LLM (Large Language Model) connecté à une base MySQL.

## 📋 Contexte

Projet académique pour le cours d'intégration de l'IA dans les systèmes d'information (Licence 3 GLSi - ESP/UCAD).

## 🎯 Objectifs

- Gérer une flotte de véhicules, chauffeurs, trajets et incidents
- Interroger les données en langage naturel via un chatbot IA
- Démontrer la conception d'un système complet : modélisation, développement backend, intégration LLM et déploiement

## 🛠 Stack Technique

- **Backend** : Node.js Express
- **Frontend** : React 18
- **Base de données** : MySQL 8.x
- **IA/LLM** : OpenAI API (gpt-4o-mini)
- **Déploiement** : Render

## 📁 Structure du projet

```
transpobot/
├── backend/           # API REST Node.js Express
├── frontend/          # Interface React
├── schema.sql        # Script SQL de création
├── rapport/           # Documents de conception
└── README.md
```

## 🚀 Installation rapide

### Prérequis
- Node.js 18+
- MySQL 8.x
- Clé API OpenAI

### 1. Base de données

```bash
mysql -u root -p < schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

## 📊 Fonctionnalités

### Gestion des données
- ✅ Affichage des véhicules avec leur statut
- ✅ Affichage des chauffeurs
- ✅ Affichage des trajets récents
- ✅ Tableau de bord avec KPIs

### Assistant IA conversationnel
- ✅ Répondre aux questions en langage naturel (français/anglais)
- ✅ Génération automatique de requêtes SQL (Text-to-SQL)
- ✅ Affichage des résultats sous forme de tableau
- ✅ Sécurité : uniquement des requêtes SELECT

### Exemples de questions
- "Combien de trajets ont été effectués cette semaine ?"
- "Quel chauffeur a le plus d'incidents ce mois-ci ?"
- "Quels véhicules nécessitent une maintenance ?"
- "Combien de chauffeurs sont actifs ?"

## 🔌 API Endpoints

- `GET /api` - Information sur l'API
- `GET /api/vehicules` - Liste des véhicules
- `GET /api/chauffeurs` - Liste des chauffeurs
- `GET /api/trajets` - Liste des trajets
- `GET /api/incidents` - Liste des incidents
- `GET /api/lignes` - Liste des lignes
- `GET /api/tarifs` - Liste des tarifs
- `GET /api/dashboard` - KPIs du tableau de bord
- `POST /api/chat` - Chat avec l'IA (Text-to-SQL)

## 🗄️ Schéma de la base de données

### Tables principales
- `vehicules` - Véhicules de la flotte
- `chauffeurs` - Chauffeurs
- `lignes` - Lignes de transport
- `tarifs` - Tarifs par ligne
- `trajets` - Trajets effectués
- `incidents` - Incidents survenus

### Vues
- `v_trajets_recents` - Vue avec détails des trajets
- `v_stats_chauffeurs` - Statistiques par chauffeur
- `v_stats_vehicules` - Statistiques par véhicule

## 🤖 Intégration OpenAI

Le chatbot utilise l'API OpenAI avec le modèle `gpt-4o-mini` pour :
- Convertir les questions en langage naturel en requêtes SQL
- Générer des explications naturelles des résultats
- Maintenir un contexte de conversation

**Sécurité** : Le prompt système est configuré pour n'autoriser que les requêtes SELECT.

## 📚 Documentation

- [Dictionnaire de données](rapport/dictionnaire_donnees.md)
- [MCD - Modèle Conceptuel de Données](rapport/MCD.md)
- [MLD - Modèle Logique de Données](rapport/MLD.md)
- [Architecture technique](rapport/architecture_technique.md)
- [Guide d'installation](rapport/guide_installation.md)

## 🌐 Déploiement

### Déploiement sur Render

1. **Base de données** : Créer une instance MySQL sur Render
2. **Backend** : Déployer le dossier `backend` comme Web Service
3. **Frontend** : Déployer le dossier `frontend` comme Static Site

Voir le [guide d'installation](rapport/guide_installation.md) pour les détails.

## 👥 Équipe

Projet réalisé dans le cadre du cours d'intégration de l'IA dans les systèmes d'information - Licence 3 GLSi - ESP/UCAD.

## 📧 Contact

Pr. Ahmath Bamba MBACKE - ahmathbamba.mbacke@esp.sn

## 📄 Licence

MIT

---

**Note** : Ce projet est à but éducatif. L'utilisation de l'API OpenAI nécessite une clé API valide avec des crédits suffisants.
