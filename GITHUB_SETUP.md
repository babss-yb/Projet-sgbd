# Guide d'initialisation du dépôt GitHub

## Étapes pour créer et pusher le projet sur GitHub

### 1. Créer un nouveau dépôt sur GitHub

1. Aller sur https://github.com/new
2. Nommer le dépôt : `transpobot`
3. Choisir "Public" ou "Private" selon préférence
4. Ne pas initialiser avec README, .gitignore ou licence
5. Cliquer sur "Create repository"

### 2. Initialiser Git localement

Ouvrir un terminal dans le dossier du projet :

```bash
cd "c:\Users\LENOVO\OneDrive\Desktop\Projet sgbd"
```

### 3. Initialiser le dépôt Git

```bash
git init
```

### 4. Ajouter tous les fichiers

```bash
git add .
```

### 5. Faire le premier commit

```bash
git commit -m "Initial commit - TranspoBot projet complet"
```

### 6. Ajouter le remote GitHub

```bash
git remote add origin https://github.com/VOTRE_USERNAME/transpobot.git
```

Remplacer `VOTRE_USERNAME` par votre nom d'utilisateur GitHub.

### 7. Pusher le code sur GitHub

```bash
git branch -M main
git push -u origin main
```

### 8. Vérifier le dépôt

Aller sur https://github.com/VOTRE_USERNAME/transpobot pour vérifier que tous les fichiers sont présents.

## Structure du dépôt

Le dépôt contiendra :

```
transpobot/
├── backend/              # API REST Node.js
├── frontend/             # Interface React
├── rapport/              # Documents de conception
├── schema.sql           # Script SQL
├── README.md            # Documentation principale
├── .gitignore           # Fichiers ignorés
├── GITHUB_SETUP.md      # Ce fichier
└── render.yaml          # Configuration déploiement (optionnel)
```

## Commandes utiles

### Vérifier le statut
```bash
git status
```

### Voir les commits
```bash
git log
```

### Créer une branche
```bash
git checkout -b nom-branche
```

### Fusionner une branche
```bash
git checkout main
git merge nom-branche
```

### Pull les changements
```bash
git pull origin main
```

## Prochaines étapes après le push

1. **Ajouter une description au dépôt** sur GitHub
2. **Ajouter des tags** pour les releases (v1.0.0)
3. **Configurer GitHub Pages** si vous voulez héberger la documentation
4. **Ajouter des issues** pour le suivi des bugs
5. **Inviter les collaborateurs** si vous travaillez en équipe

## Notes importantes

- Assurez-vous que le fichier `.env` n'est pas commité (déjà dans .gitignore)
- Ne committez jamais de clés API ou de mots de passe
- Le fichier `backend/.env` doit être créé manuellement après clonage
- Utilisez `backend/.env.example` comme template

## Déploiement après le push

Une fois le code sur GitHub :

1. **Backend sur Render** :
   - Connecter le dépôt GitHub à Render
   - Configurer les variables d'environnement
   - Déployer automatiquement

2. **Frontend sur Render** :
   - Connecter le dépôt GitHub à Render
   - Configurer comme Static Site
   - Déployer automatiquement

Voir le guide d'installation détaillé dans `rapport/guide_installation.md`.
