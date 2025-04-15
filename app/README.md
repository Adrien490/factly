# Architecture du dossier `app` (Next.js App Router)

Ce dossier contient l'interface utilisateur de l'application, structurée selon les conventions du App Router de Next.js. Il représente la couche de présentation dans notre architecture DDD.

## Structure générale

```
app/
├── (public)/           # Pages publiques (landing, etc.)
├── api/                # Routes API (API REST, uploadthing, webhooks)
├── dashboard/          # Interface d'administration
│   └── [organizationId]/ # Routes spécifiques aux organisations
├── login/              # Pages d'authentification
├── layout.tsx          # Layout principal de l'application
└── globals.css         # Styles globaux
```

## Organisation des routes

Chaque route suit la convention de Next.js App Router:

```
dashboard/[organizationId]/clients/
├── page.tsx            # Page principale (liste des clients)
├── loading.tsx         # État de chargement
├── new/                # Sous-route pour création
│   └── page.tsx        # Page de création de client
└── [clientId]/         # Route dynamique par ID de client
    └── page.tsx        # Page de détail d'un client
```

## Principes d'organisation

1. **Séparation des responsabilités**

   - Les pages (`page.tsx`) contiennent uniquement la structure UI
   - La logique métier est importée depuis le dossier `domains`
   - Les composants réutilisables sont dans `shared/components`

2. **Routage dynamique**

   - Utilisation des segments dynamiques (`[paramId]`) pour les routes paramétrées
   - Convention de nommage cohérente pour les IDs d'entités

3. **Chargement et erreurs**

   - Fichiers `loading.tsx` pour l'état de chargement
   - Fichiers `error.tsx` pour la gestion des erreurs
   - Utilisation de Suspense pour le chargement progressif

4. **Conventions de nommage**
   - Segments entre parenthèses `(layout)` pour les groupes sans impact sur l'URL
   - Tous les fichiers utilisent PascalCase pour les composants React

## Relation avec l'architecture DDD

L'App Router implémente la couche de présentation de notre architecture, en suivant ces principes:

- **UI découplée de la logique métier**: Les composants UI appellent des hooks et actions définis dans les domaines
- **Agrégation des données**: Les composants page orchestrent plusieurs domaines pour présenter une vue cohérente
- **Routes alignées avec les cas d'utilisation**: La structure des URLs reflète les parcours utilisateur

## Bonnes pratiques

- **Server Components**: Utiliser les Server Components par défaut pour optimiser les performances
- **Client Components**: Utiliser "use client" uniquement pour les composants nécessitant interactivité
- **Imports propres**: Importer depuis les API publiques des domaines (`@/domains/client`) et non leurs fichiers internes
- **Accessibilité**: Respecter les standards WCAG dans tous les composants d'interface
- **Performances**: Exploiter le code splitting automatique de Next.js et optimiser les images avec next/image

## Communication avec les domaines

Les pages communiquent avec la couche domaine en important les fonctionnalités exposées par chaque domaine:
