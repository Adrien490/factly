# Architecture DDD (Domain-Driven Design)

Ce dossier `domains` contient l'ensemble des domaines métier de l'application, organisés selon les principes du Domain-Driven Design.

## Structure générale

```
domains/
├── client/              # Domaine client
├── organization/        # Domaine organisation
├── address/             # Domaine adresse
├── auth/                # Domaine authentification
└── [autres domaines]    # Autres domaines métier
```

## Organisation d'un domaine

Chaque domaine est structuré de la manière suivante:

```
domains/client/
├── features/            # Fonctionnalités du domaine
│   ├── create-client/   # Feature spécifique
│   ├── update-client/
│   ├── get-clients/
│   └── ...
├── constants/           # Constantes liées au domaine
├── types/               # Types spécifiques au domaine
└── index.ts             # Exports publics du domaine
```

## Structure d'une feature

Une feature représente une capacité fonctionnelle du domaine et est organisée comme suit:

```
features/create-client/
├── actions/             # Server actions (mutations)
├── queries/             # Fonctions de requête (lectures)
├── components/          # Composants UI spécifiques
├── hooks/               # Hooks React
├── schemas/             # Validation des données
├── types/               # Types spécifiques à la feature
├── constants/           # Constantes de la feature
└── index.ts             # Exports publics de la feature
```

## Règles et principes

1. **Séparation des responsabilités**

   - Les `actions` sont responsables des opérations modifiant les données (create, update, delete)
   - Les `queries` sont responsables des opérations de lecture
   - Les `helpers` contiennent des fonctions utilitaires internes à la feature

2. **Autonomie des domaines**

   - Chaque domaine doit être autonome et avoir ses propres types, schémas et logique
   - Les dépendances entre domaines doivent être explicites et minimisées

3. **Organisation par features**

   - Toutes les fonctionnalités, qu'elles soient des commandes ou des requêtes, sont placées dans le dossier `features`
   - Chaque feature regroupe tout le code nécessaire à une capacité fonctionnelle

4. **Exportations**
   - Chaque domaine expose son API publique via son fichier `index.ts`
   - Les features exposent leurs fonctionnalités via leur propre `index.ts`

## Bonnes pratiques

- **Validation** : Toujours valider les données en entrée avec les schémas Zod
- **Erreurs** : Gérer les erreurs de manière cohérente et explicite
- **Abstraction** : Éviter les dépendances directes aux infrastructures (DB, etc.)
- **Tests** : Créer des tests pour chaque feature dans un dossier `__tests__`
- **Cohérence** : Maintenir une structure cohérente entre les différentes features

## Communication entre domaines

Les domaines peuvent communiquer entre eux en important les fonctionnalités exposées par les index.ts de chaque domaine. Évitez d'importer directement des fichiers internes d'un autre domaine.

```typescript
// Bon: Import via l'API publique du domaine
import { getOrganization } from "@/domains/organization";

// Mauvais: Import direct d'un fichier interne
import { getOrganization } from "@/domains/organization/features/get-organization/queries/get-organization";
```
