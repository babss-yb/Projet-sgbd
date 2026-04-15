-- ============================================================================
-- TranspoBot - Schéma de base de données MySQL
-- Gestion de Transport Urbain avec IA
-- ESP/UCAD - Licence 3 GLSi
-- ============================================================================

-- Suppression des tables existantes si elles existent
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS trajets;
DROP TABLE IF EXISTS tarifs;
DROP TABLE IF EXISTS lignes;
DROP TABLE IF EXISTS vehicules;
DROP TABLE IF EXISTS chauffeurs;

-- ============================================================================
-- Table : chauffeurs
-- Description : Informations sur les chauffeurs de la flotte
-- ============================================================================
CREATE TABLE chauffeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    date_embauche DATE NOT NULL,
    permis VARCHAR(20) NOT NULL,
    statut ENUM('actif', 'conge', 'suspendu') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_statut (statut),
    INDEX idx_nom (nom, prenom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table : vehicules
-- Description : Informations sur les véhicules de la flotte
-- ============================================================================
CREATE TABLE vehicules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    type_vehicule ENUM('bus', 'minibus', 'taxi', 'van') NOT NULL,
    capacite INT NOT NULL,
    kilometrage INT DEFAULT 0,
    date_mise_service DATE NOT NULL,
    statut ENUM('actif', 'maintenance', 'hors_service', 'en_route') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_statut (statut),
    INDEX idx_immatriculation (immatriculation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table : lignes
-- Description : Lignes de transport avec leurs trajets
-- ============================================================================
CREATE TABLE lignes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    distance_km DECIMAL(6,2) NOT NULL,
    duree_estimee INT NOT NULL, -- en minutes
    statut ENUM('actif', 'suspendu') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table : tarifs
-- Description : Tarifs par ligne et type de ticket
-- ============================================================================
CREATE TABLE tarifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ligne_id INT NOT NULL,
    type_ticket ENUM('standard', 'etudiant', 'senior', 'abonnement_mensuel') NOT NULL,
    prix DECIMAL(6,2) NOT NULL,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ligne_id) REFERENCES lignes(id) ON DELETE CASCADE,
    INDEX idx_ligne (ligne_id),
    INDEX idx_type (type_ticket)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table : trajets
-- Description : Trajets effectués par les véhicules
-- ============================================================================
CREATE TABLE trajets (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE RESTRICT,
    FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id) ON DELETE RESTRICT,
    FOREIGN KEY (ligne_id) REFERENCES lignes(id) ON DELETE RESTRICT,
    INDEX idx_vehicule (vehicule_id),
    INDEX idx_chauffeur (chauffeur_id),
    INDEX idx_ligne (ligne_id),
    INDEX idx_date_depart (date_heure_depart),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table : incidents
-- Description : Incidents survenus lors des trajets
-- ============================================================================
CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trajet_id INT NOT NULL,
    type_incident ENUM('mecanique', 'accident', 'retard', 'agression', 'panne', 'autre') NOT NULL,
    description TEXT,
    gravite ENUM('mineure', 'moyenne', 'majeure') NOT NULL,
    date_incident DATETIME NOT NULL,
    resolu BOOLEAN DEFAULT FALSE,
    date_resolution DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE,
    INDEX idx_trajet (trajet_id),
    INDEX idx_type (type_incident),
    INDEX idx_date (date_incident),
    INDEX idx_resolu (resolu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DONNÉES DE TEST
-- ============================================================================

-- Insertion des chauffeurs
INSERT INTO chauffeurs (nom, prenom, telephone, email, date_embauche, permis, statut) VALUES
('FALL', 'Ibrahima', '+221771234567', 'ibrahima.fall@email.com', '2022-01-15', 'B-123456', 'actif'),
('NDOYE', 'Fatou', '+221772345678', 'fatou.ndoye@email.com', '2021-06-20', 'B-234567', 'actif'),
('DIOUF', 'Moussa', '+221773456789', 'moussa.diouf@email.com', '2023-03-10', 'B-345678', 'actif'),
('SOW', 'Aminata', '+221774567890', 'aminata.sow@email.com', '2022-09-05', 'B-456789', 'actif'),
('BA', 'Cheikh', '+221775678901', 'cheikh.ba@email.com', '2020-11-12', 'B-567890', 'conge'),
('MBAYE', 'Mariama', '+221776789012', 'mariama.mbaye@email.com', '2023-01-20', 'B-678901', 'actif'),
('KANE', 'Ousmane', '+221777890123', 'ousmane.kane@email.com', '2021-08-25', 'B-789012', 'suspendu');

-- Insertion des véhicules
INSERT INTO vehicules (immatriculation, marque, modele, type_vehicule, capacite, kilometrage, date_mise_service, statut) VALUES
('DK-9012-EF', 'Mercedes', 'Sprinter', 'minibus', 18, 45000, '2021-03-01', 'actif'),
('DK-2345-FG', 'Toyota', 'Coaster', 'bus', 30, 78000, '2020-07-15', 'actif'),
('DK-5678-GH', 'Hyundai', 'H350', 'van', 14, 32000, '2022-01-20', 'maintenance'),
('DK-8901-HI', 'Mercedes', 'Citaro', 'bus', 45, 120000, '2019-05-10', 'actif'),
('DK-1234-IJ', 'Peugeot', 'Boxer', 'minibus', 16, 55000, '2021-11-30', 'actif'),
('DK-3456-JK', 'Renault', 'Master', 'van', 12, 28000, '2022-06-15', 'hors_service'),
('DK-6789-KL', 'Toyota', 'Hiace', 'minibus', 15, 41000, '2021-08-20', 'en_route');

-- Insertion des lignes
INSERT INTO lignes (code, nom, depart, arrivee, distance_km, duree_estimee, statut) VALUES
('L01', 'Ligne Dakar - Pikine', 'Dakar (Plateau)', 'Pikine (Guédiawaye)', 15.5, 45, 'actif'),
('L02', 'Ligne Dakar - Rufisque', 'Dakar (Plateau)', 'Rufisque (Centre)', 28.0, 60, 'actif'),
('L03', 'Ligne Dakar - Thiès', 'Dakar (Plateau)', 'Thiès (Centre)', 70.0, 90, 'actif'),
('L04', 'Ligne Pikine - Rufisque', 'Pikine (Guédiawaye)', 'Rufisque (Centre)', 18.5, 40, 'actif'),
('L05', 'Ligne Dakar - Mbour', 'Dakar (Plateau)', 'Mbour (Centre)', 85.0, 100, 'suspendu');

-- Insertion des tarifs
INSERT INTO tarifs (ligne_id, type_ticket, prix, description) VALUES
(1, 'standard', 150.00, 'Ticket standard'),
(1, 'etudiant', 100.00, 'Tarif étudiant avec carte'),
(1, 'senior', 100.00, 'Tarif senior +60 ans'),
(1, 'abonnement_mensuel', 4500.00, 'Abonnement mensuel illimité'),
(2, 'standard', 250.00, 'Ticket standard'),
(2, 'etudiant', 175.00, 'Tarif étudiant avec carte'),
(2, 'senior', 175.00, 'Tarif senior +60 ans'),
(2, 'abonnement_mensuel', 7500.00, 'Abonnement mensuel illimité'),
(3, 'standard', 500.00, 'Ticket standard'),
(3, 'etudiant', 350.00, 'Tarif étudiant avec carte'),
(3, 'senior', 350.00, 'Tarif senior +60 ans'),
(3, 'abonnement_mensuel', 15000.00, 'Abonnement mensuel illimité'),
(4, 'standard', 200.00, 'Ticket standard'),
(4, 'etudiant', 140.00, 'Tarif étudiant avec carte'),
(4, 'senior', 140.00, 'Tarif senior +60 ans'),
(4, 'abonnement_mensuel', 6000.00, 'Abonnement mensuel illimité');

-- Insertion des trajets (données récentes pour les tests)
INSERT INTO trajets (vehicule_id, chauffeur_id, ligne_id, date_heure_depart, date_heure_arrivee, nombre_passagers, recette, statut) VALUES
(1, 1, 1, '2025-04-06 07:00:00', '2025-04-06 07:45:00', 15, 2250.00, 'termine'),
(1, 1, 1, '2025-04-06 08:30:00', '2025-04-06 09:15:00', 12, 1800.00, 'termine'),
(2, 2, 2, '2025-04-06 07:15:00', '2025-04-06 08:15:00', 25, 6250.00, 'termine'),
(2, 2, 2, '2025-04-06 09:00:00', '2025-04-06 10:00:00', 28, 7000.00, 'termine'),
(4, 3, 3, '2025-04-07 06:30:00', '2025-04-07 08:00:00', 40, 20000.00, 'termine'),
(1, 1, 1, '2025-04-07 07:00:00', '2025-04-07 07:48:00', 16, 2400.00, 'termine'),
(5, 4, 1, '2025-04-07 08:00:00', '2025-04-07 08:50:00', 14, 2100.00, 'termine'),
(2, 2, 2, '2025-04-08 07:30:00', '2025-04-08 08:35:00', 22, 5500.00, 'termine'),
(4, 3, 3, '2025-04-08 06:00:00', '2025-04-08 07:35:00', 42, 21000.00, 'termine'),
(7, 6, 4, '2025-04-08 09:00:00', '2025-04-08 09:42:00', 12, 2400.00, 'termine'),
(1, 1, 1, '2025-04-09 07:00:00', NULL, 0, 0.00, 'en_cours'),
(5, 4, 2, '2025-04-09 08:00:00', NULL, 0, 0.00, 'planifie'),
(2, 2, 3, '2025-04-10 06:30:00', NULL, 0, 0.00, 'planifie'),
(4, 3, 1, '2025-04-10 07:15:00', NULL, 0, 0.00, 'planifie'),
(7, 6, 4, '2025-04-11 08:30:00', NULL, 0, 0.00, 'planifie'),
(1, 1, 2, '2025-04-12 07:00:00', NULL, 0, 0.00, 'planifie');

-- Insertion des incidents
INSERT INTO incidents (trajet_id, type_incident, description, gravite, date_incident, resolu, date_resolution) VALUES
(2, 'retard', 'Embouteillage exceptionnel sur la route de Rufisque', 'mineure', '2025-04-06 09:30:00', TRUE, '2025-04-06 10:00:00'),
(4, 'mecanique', 'Problème de freinage, arrêt pour vérification', 'moyenne', '2025-04-06 09:45:00', TRUE, '2025-04-06 13:00:00'),
(6, 'panne', 'Panne moteur sur la ligne Dakar - Pikine', 'majeure', '2025-04-07 08:20:00', TRUE, '2025-04-07 14:30:00'),
(8, 'retard', 'Retard dû aux intempéries (pluie)', 'mineure', '2025-04-08 08:00:00', TRUE, '2025-04-08 08:45:00'),
(10, 'mecanique', 'Climatisation défaillante', 'mineure', '2025-04-08 09:30:00', FALSE, NULL),
(3, 'accident', 'Légère collision sans blessure', 'moyenne', '2025-04-07 07:15:00', TRUE, '2025-04-07 12:00:00'),
(9, 'agression', 'Conflit entre passagers', 'moyenne', '2025-04-08 07:00:00', TRUE, '2025-04-08 07:30:00');

-- ============================================================================
-- Vues pour faciliter les requêtes
-- ============================================================================

-- Vue : Résumé des trajets récents
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
FROM trajets t
JOIN vehicules v ON t.vehicule_id = v.id
JOIN chauffeurs c ON t.chauffeur_id = c.id
JOIN lignes l ON t.ligne_id = l.id
ORDER BY t.date_heure_depart DESC;

-- Vue : Statistiques par chauffeur
CREATE VIEW v_stats_chauffeurs AS
SELECT 
    c.id,
    c.nom,
    c.prenom,
    COUNT(t.id) AS nombre_trajets,
    SUM(t.nombre_passagers) AS total_passagers,
    SUM(t.recette) AS total_recette,
    COUNT(i.id) AS nombre_incidents
FROM chauffeurs c
LEFT JOIN trajets t ON c.id = t.chauffeur_id
LEFT JOIN incidents i ON t.id = i.trajet_id
GROUP BY c.id, c.nom, c.prenom;

-- Vue : Statistiques par véhicule
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
FROM vehicules v
LEFT JOIN trajets t ON v.id = t.vehicule_id
GROUP BY v.id, v.immatriculation, v.marque, v.modele, v.kilometrage, v.statut;

-- ============================================================================
-- Fin du script
-- ============================================================================
