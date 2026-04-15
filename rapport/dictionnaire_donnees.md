# Dictionnaire de Données - TranspoBot

## Table : chauffeurs

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique du chauffeur | Clé primaire, AUTO_INCREMENT |
| nom | VARCHAR | 50 | Nom du chauffeur | NOT NULL |
| prenom | VARCHAR | 50 | Prénom du chauffeur | NOT NULL |
| telephone | VARCHAR | 20 | Numéro de téléphone | NOT NULL, UNIQUE |
| email | VARCHAR | 100 | Adresse email | UNIQUE |
| date_embauche | DATE | - | Date d'embauche | NOT NULL |
| permis | VARCHAR | 20 | Numéro de permis de conduire | NOT NULL |
| statut | ENUM | - | Statut du chauffeur | NOT NULL, DEFAULT 'actif' |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines statut** : 'actif', 'conge', 'suspendu'

---

## Table : vehicules

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique du véhicule | Clé primaire, AUTO_INCREMENT |
| immatriculation | VARCHAR | 20 | Numéro d'immatriculation | NOT NULL, UNIQUE |
| marque | VARCHAR | 50 | Marque du véhicule | NOT NULL |
| modele | VARCHAR | 50 | Modèle du véhicule | NOT NULL |
| type_vehicule | ENUM | - | Type de véhicule | NOT NULL |
| capacite | INT | - | Capacité en passagers | NOT NULL |
| kilometrage | INT | - | Kilométrage total | DEFAULT 0 |
| date_mise_service | DATE | - | Date de mise en service | NOT NULL |
| statut | ENUM | - | Statut du véhicule | NOT NULL, DEFAULT 'actif' |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines type_vehicule** : 'bus', 'minibus', 'taxi', 'van'
**Domaines statut** : 'actif', 'maintenance', 'hors_service', 'en_route'

---

## Table : lignes

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique de la ligne | Clé primaire, AUTO_INCREMENT |
| code | VARCHAR | 10 | Code de la ligne | NOT NULL, UNIQUE |
| nom | VARCHAR | 100 | Nom de la ligne | NOT NULL |
| depart | VARCHAR | 100 | Point de départ | NOT NULL |
| arrivee | VARCHAR | 100 | Point d'arrivée | NOT NULL |
| distance_km | DECIMAL | 6,2 | Distance en kilomètres | NOT NULL |
| duree_estimee | INT | - | Durée estimée en minutes | NOT NULL |
| statut | ENUM | - | Statut de la ligne | NOT NULL, DEFAULT 'actif' |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines statut** : 'actif', 'suspendu'

---

## Table : tarifs

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique du tarif | Clé primaire, AUTO_INCREMENT |
| ligne_id | INT | - | Référence à la ligne | NOT NULL, Clé étrangère vers lignes(id) |
| type_ticket | ENUM | - | Type de ticket | NOT NULL |
| prix | DECIMAL | 6,2 | Prix du ticket | NOT NULL |
| description | VARCHAR | 100 | Description du tarif | - |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines type_ticket** : 'standard', 'etudiant', 'senior', 'abonnement_mensuel'
**Contrainte** : FOREIGN KEY (ligne_id) REFERENCES lignes(id) ON DELETE CASCADE

---

## Table : trajets

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique du trajet | Clé primaire, AUTO_INCREMENT |
| vehicule_id | INT | - | Référence au véhicule | NOT NULL, Clé étrangère vers vehicules(id) |
| chauffeur_id | INT | - | Référence au chauffeur | NOT NULL, Clé étrangère vers chauffeurs(id) |
| ligne_id | INT | - | Référence à la ligne | NOT NULL, Clé étrangère vers lignes(id) |
| date_heure_depart | DATETIME | - | Date et heure de départ | NOT NULL |
| date_heure_arrivee | DATETIME | - | Date et heure d'arrivée | - |
| nombre_passagers | INT | - | Nombre de passagers | DEFAULT 0 |
| recette | DECIMAL | 10,2 | Recette du trajet | DEFAULT 0.00 |
| statut | ENUM | - | Statut du trajet | NOT NULL, DEFAULT 'planifie' |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines statut** : 'planifie', 'en_cours', 'termine', 'annule'
**Contraintes** : 
- FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE RESTRICT
- FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id) ON DELETE RESTRICT
- FOREIGN KEY (ligne_id) REFERENCES lignes(id) ON DELETE RESTRICT

---

## Table : incidents

| Attribut | Type | Taille | Description | Contraintes |
|----------|------|--------|-------------|-------------|
| id | INT | - | Identifiant unique de l'incident | Clé primaire, AUTO_INCREMENT |
| trajet_id | INT | - | Référence au trajet | NOT NULL, Clé étrangère vers trajets(id) |
| type_incident | ENUM | - | Type d'incident | NOT NULL |
| description | TEXT | - | Description détaillée | - |
| gravite | ENUM | - | Gravité de l'incident | NOT NULL |
| date_incident | DATETIME | - | Date et heure de l'incident | NOT NULL |
| resolu | BOOLEAN | - | Incident résolu | DEFAULT FALSE |
| date_resolution | DATETIME | - | Date de résolution | - |
| created_at | TIMESTAMP | - | Date de création | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | - | Date de dernière modification | ON UPDATE CURRENT_TIMESTAMP |

**Domaines type_incident** : 'mecanique', 'accident', 'retard', 'agression', 'panne', 'autre'
**Domaines gravite** : 'mineure', 'moyenne', 'majeure'
**Contrainte** : FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE

---

## Vues

### v_trajets_recents
Vue combinant les informations des trajets avec les détails des véhicules, chauffeurs et lignes.

### v_stats_chauffeurs
Vue de statistiques par chauffeur (nombre de trajets, total passagers, recette, incidents).

### v_stats_vehicules
Vue de statistiques par véhicule (nombre de trajets, total passagers, recette).
