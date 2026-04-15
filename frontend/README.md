# TranspoBot - Frontend React

Interface utilisateur React pour TranspoBot - Gestion de Transport Urbain avec IA.

## Technologies

- React 18
- Axios
- Lucide React (icônes)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm start
```

L'application sera disponible sur http://localhost:3000

## Fonctionnalités

- **Tableau de bord** : KPIs en temps réel (véhicules, chauffeurs, trajets, incidents)
- **Données** : Consultation des données (véhicules, chauffeurs, trajets, incidents, lignes, tarifs)
- **Assistant IA** : Chat conversationnel avec Text-to-SQL pour interroger la base de données en langage naturel

## Configuration

L'API URL est configurée dans `package.json` avec le proxy :
```json
"proxy": "http://localhost:3000"
```

Assurez-vous que le backend est démarré sur le port 3000.
