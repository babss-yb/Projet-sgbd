# Modèle Conceptuel de Données (MCD) - TranspoBot

## Description textuelle du MCD

Le MCD de TranspoBot représente les entités et leurs relations pour la gestion du transport urbain.

### Entités

1. **CHAUFFEUR**
   - Identifiant unique
   - Nom, Prénom
   - Téléphone, Email
   - Date d'embauche
   - Numéro de permis
   - Statut (actif, congé, suspendu)

2. **VEHICULE**
   - Identifiant unique
   - Immatriculation
   - Marque, Modèle
   - Type de véhicule
   - Capacité
   - Kilométrage
   - Date de mise en service
   - Statut (actif, maintenance, hors service, en route)

3. **LIGNE**
   - Identifiant unique
   - Code
   - Nom
   - Point de départ
   - Point d'arrivée
   - Distance
   - Durée estimée
   - Statut (actif, suspendu)

4. **TARIF**
   - Identifiant unique
   - Type de ticket
   - Prix
   - Description

5. **TRAJET**
   - Identifiant unique
   - Date et heure de départ
   - Date et heure d'arrivée
   - Nombre de passagers
   - Recette
   - Statut (planifié, en cours, terminé, annulé)

6. **INCIDENT**
   - Identifiant unique
   - Type d'incident
   - Description
   - Gravité
   - Date de l'incident
   - Statut de résolution
   - Date de résolution

### Relations

1. **TRAJET - VEHICULE** (1,n)
   - Un véhicule peut effectuer plusieurs trajets
   - Un trajet est effectué par un seul véhicule
   - Relation : Un véhicule réalise des trajets

2. **TRAJET - CHAUFFEUR** (1,n)
   - Un chauffeur peut effectuer plusieurs trajets
   - Un trajet est effectué par un seul chauffeur
   - Relation : Un chauffeur réalise des trajets

3. **TRAJET - LIGNE** (1,n)
   - Une ligne peut avoir plusieurs trajets
   - Un trajet appartient à une seule ligne
   - Relation : Un trajet est sur une ligne

4. **LIGNE - TARIF** (1,n)
   - Une ligne peut avoir plusieurs tarifs
   - Un tarif appartient à une seule ligne
   - Relation : Une ligne a des tarifs

5. **INCIDENT - TRAJET** (0,n)
   - Un trajet peut avoir plusieurs incidents
   - Un incident appartient à un seul trajet
   - Relation : Un incident survient sur un trajet

### Cardinalités

- **CHAUFFEUR (1,n) — (0,n) TRAJET** : Un chauffeur peut réaliser 0 à n trajets, un trajet est réalisé par 1 chauffeur
- **VEHICULE (1,n) — (0,n) TRAJET** : Un véhicule peut réaliser 0 à n trajets, un trajet est réalisé par 1 véhicule
- **LIGNE (1,n) — (0,n) TRAJET** : Une ligne peut avoir 0 à n trajets, un trajet appartient à 1 ligne
- **LIGNE (1,n) — (1,n) TARIF** : Une ligne a 1 à n tarifs, un tarif appartient à 1 ligne
- **TRAJET (0,n) — (0,n) INCIDENT** : Un trajet peut avoir 0 à n incidents, un incident appartient à 1 trajet

## Représentation graphique (ASCII)

```
┌─────────────┐         ┌─────────────┐
│  CHAUFFEUR  │         │  VEHICULE   │
├─────────────┤         ├─────────────┤
│ id (1,1)    │         │ id (1,1)    │
│ nom         │         │ immatricul. │
│ prenom      │         │ marque      │
│ telephone   │         │ modele      │
│ email       │         │ type        │
│ date_embauche│        │ capacite    │
│ permis      │         │ kilometrage │
│ statut      │         │ date_mise   │
└──────┬──────┘         │ statut      │
       │                └──────┬──────┘
       │                       │
       │ 1,n                   │ 1,n
       │                       │
       │                       │
┌──────▼──────────────┐   ┌───▼─────────────┐
│      TRAJET         │   │     LIGNE       │
├─────────────────────┤   ├─────────────────┤
│ id (1,1)            │   │ id (1,1)        │
│ date_heure_depart   │   │ code            │
│ date_heure_arrivee  │   │ nom             │
│ nombre_passagers    │   │ depart          │
│ recette             │   │ arrivee         │
│ statut              │   │ distance_km     │
└──────┬──────────────┘   │ duree_estimee   │
       │                  │ statut          │
       │ 0,n              └──────┬──────────┘
       │                         │
       │                         │ 1,n
       │                         │
┌──────▼──────┐           ┌──────▼──────┐
│  INCIDENT   │           │   TARIF     │
├─────────────┤           ├─────────────┤
│ id (1,1)    │           │ id (1,1)    │
│ type        │           │ type_ticket │
│ description │           │ prix        │
│ gravite     │           │ description │
│ date_incident│           └─────────────┘
│ resolu      │
│ date_resolu │
└─────────────┘
```

## Règles de gestion

1. **RG1** : Chaque chauffeur possède un numéro de permis unique.
2. **RG2** : Chaque véhicule a une immatriculation unique.
3. **RG3** : Un trajet ne peut être réalisé que par un véhicule et un chauffeur actifs.
4. **RG4** : Un trajet ne peut être supprimé s'il a des incidents associés.
5. **RG5** : Un véhicule ne peut être supprimé s'il a des trajets enregistrés.
6. **RG6** : Un chauffeur ne peut être supprimé s'il a des trajets enregistrés.
7. **RG7** : La suppression d'une ligne entraîne la suppression de ses tarifs et trajets.
8. **RG8** : Le statut d'un véhicule influence sa disponibilité pour les trajets.
