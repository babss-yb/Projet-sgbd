# Modèle Logique de Données (MLD) - TranspoBot

## Transformation du MCD en MLD

Le MLD est obtenu à partir du MCD en appliquant les règles de passage du modèle entité-association au modèle relationnel.

### Règles de transformation appliquées

1. **Entité → Table** : Chaque entité devient une table
2. **Identifiant → Clé primaire** : L'identifiant de l'entité devient la clé primaire de la table
3. **Relation 1,n → Clé étrangère** : La relation devient une clé étrangère dans la table côté n
4. **Relation 0,n → Clé étrangère nullable** : La clé étrangère peut être NULL si la cardinalité est 0,n

## Tables du MLD

### 1. Table CHAUFFEURS

```
CHAUFFEURS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    date_embauche DATE NOT NULL,
    permis VARCHAR(20) NOT NULL,
    statut ENUM('actif', 'conge', 'suspendu') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Index** : idx_statut, idx_nom

---

### 2. Table VEHICULES

```
VEHICULES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    type_vehicule ENUM('bus', 'minibus', 'taxi', 'van') NOT NULL,
    capacite INT NOT NULL,
    kilometrage INT DEFAULT 0,
    date_mise_service DATE NOT NULL,
    statut ENUM('actif', 'maintenance', 'hors_service', 'en_route') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Index** : idx_statut, idx_immatriculation

---

### 3. Table LIGNES

```
LIGNES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    distance_km DECIMAL(6,2) NOT NULL,
    duree_estimee INT NOT NULL,
    statut ENUM('actif', 'suspendu') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Index** : idx_code, idx_statut

---

### 4. Table TARIFS

```
TARIFS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ligne_id INT NOT NULL,
    type_ticket ENUM('standard', 'etudiant', 'senior', 'abonnement_mensuel') NOT NULL,
    prix DECIMAL(6,2) NOT NULL,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ligne_id) REFERENCES LIGNES(id) ON DELETE CASCADE
)
```

**Index** : idx_ligne, idx_type

---

### 5. Table TRAJETS

```
TRAJETS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicule_id INT NOT NULL,
    chauffeur_id INT NOT NULL,
    ligne_id INT NOT NULL,
    date_heure_depart DATETIME NOT NULL,
    date_heure_arrivee DATETIME,
    nombre_passagers INT DEFAULT 0,
    recette DECIMAL(10,2) DEFAULT 0.00,
    statut ENUM('planifie', 'en_cours', 'termine', 'annule') DEFAULT 'planifie',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES VEHICULES(id) ON DELETE RESTRICT,
    FOREIGN KEY (chauffeur_id) REFERENCES CHAUFFEURS(id) ON DELETE RESTRICT,
    FOREIGN KEY (ligne_id) REFERENCES LIGNES(id) ON DELETE RESTRICT
)
```

**Index** : idx_vehicule, idx_chauffeur, idx_ligne, idx_date_depart, idx_statut

---

### 6. Table INCIDENTS

```
INCIDENTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trajet_id INT NOT NULL,
    type_incident ENUM('mecanique', 'accident', 'retard', 'agression', 'panne', 'autre') NOT NULL,
    description TEXT,
    gravite ENUM('mineure', 'moyenne', 'majeure') NOT NULL,
    date_incident DATETIME NOT NULL,
    resolu BOOLEAN DEFAULT FALSE,
    date_resolution DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trajet_id) REFERENCES TRAJETS(id) ON DELETE CASCADE
)
```

**Index** : idx_trajet, idx_type, idx_date, idx_resolu

---

## Vues du MLD

### Vue v_trajets_recents

```
CREATE VIEW v_trajets_recents AS
SELECT 
    t.id,
    v.immatriculation,
    CONCAT(c.nom, ' ', c.prenom) AS chauffeur,
    l.code AS ligne_code,
    l.nom AS ligne_nom,
    t.date_heure_depart,
    t.date_heure_arrivee,
    t.nombre_passagers,
    t.recette,
    t.statut
FROM TRAJETS t
JOIN VEHICULES v ON t.vehicule_id = v.id
JOIN CHAUFFEURS c ON t.chauffeur_id = c.id
JOIN LIGNES l ON t.ligne_id = l.id
ORDER BY t.date_heure_depart DESC
```

### Vue v_stats_chauffeurs

```
CREATE VIEW v_stats_chauffeurs AS
SELECT 
    c.id,
    c.nom,
    c.prenom,
    COUNT(t.id) AS nombre_trajets,
    SUM(t.nombre_passagers) AS total_passagers,
    SUM(t.recette) AS total_recette,
    COUNT(i.id) AS nombre_incidents
FROM CHAUFFEURS c
LEFT JOIN TRAJETS t ON c.id = t.chauffeur_id
LEFT JOIN INCIDENTS i ON t.id = i.trajet_id
GROUP BY c.id, c.nom, c.prenom
```

### Vue v_stats_vehicules

```
CREATE VIEW v_stats_vehicules AS
SELECT 
    v.id,
    v.immatriculation,
    v.marque,
    v.modele,
    v.kilometrage,
    v.statut,
    COUNT(t.id) AS nombre_trajets,
    SUM(t.nombre_passagers) AS total_passagers,
    SUM(t.recette) AS total_recette
FROM VEHICULES v
LEFT JOIN TRAJETS t ON v.id = t.vehicule_id
GROUP BY v.id, v.immatriculation, v.marque, v.modele, v.kilometrage, v.statut
```

## Contraintes d'intégrité

### Contraintes de clé primaire
- Chaque table a une clé primaire `id` en AUTO_INCREMENT

### Contraintes d'unicité
- `chauffeurs.telephone` : UNIQUE
- `chauffeurs.email` : UNIQUE
- `vehicules.immatriculation` : UNIQUE
- `lignes.code` : UNIQUE

### Contraintes de clé étrangère
- `tarifs.ligne_id` → `lignes.id` (CASCADE DELETE)
- `trajets.vehicule_id` → `vehicules.id` (RESTRICT)
- `trajets.chauffeur_id` → `chauffeurs.id` (RESTRICT)
- `trajets.ligne_id` → `lignes.id` (RESTRICT)
- `incidents.trajet_id` → `trajets.id` (CASCADE DELETE)

### Contraintes de domaine
- Enums pour les champs à valeurs prédéfinies (statut, type_vehicule, type_ticket, etc.)
- Types DECIMAL pour les montants monétaires
- Types DATE/DATETIME pour les dates
- NOT NULL pour les champs obligatoires

## Normalisation

Le schéma est en **3ème Forme Normale (3FN)** :
- 1FN : Tous les attributs sont atomiques
- 2FN : Pas de dépendance partielle de clé non élémentaire
- 3FN : Pas de dépendance transitive de clé non élémentaire
