# Cahier des Charges Technique - Application Factly

## Meubles Morinière

---

## 1. Présentation du Projet

### 1.1 Contexte

**Factly** est une application de gestion commerciale sur mesure développée spécifiquement pour les besoins de l'entreprise Meubles Morinière. Cette solution vise à centraliser et optimiser la gestion des relations clients, des fournisseurs, du catalogue produits et des processus commerciaux.

### 1.2 Objectifs

- Centraliser la gestion des clients et prospects
- Optimiser la gestion du catalogue produits et des fournisseurs
- Faciliter les processus de vente (devis, commandes, factures)
- Améliorer le suivi commercial et la relation client
- Assurer une gestion rigoureuse des données légales et fiscales

---

## 2. Architecture Technique

### 2.1 Stack Technologique

- **Frontend** : Next.js 15.3.2 avec React 19.1.0
- **Backend** : Next.js API Routes avec Server Actions
- **Base de données** : PostgreSQL avec Prisma ORM 6.7.0
- **Authentification** : Better Auth 1.2.7 avec support des passkeys
- **UI/UX** : Tailwind CSS 4 + Radix UI + Shadcn/ui
- **Validation** : Zod 3.24.3 pour la validation des schémas
- **Formulaires** : TanStack React Form 1.3.3
- **Notifications** : Sonner 2.0.2 pour les toasts
- **Upload** : UploadThing 7.6.0 pour la gestion des fichiers

### 2.2 Architecture DDD (Domain-Driven Design)

L'application suit une architecture par domaines métier :

```
domains/
├── client/              # Gestion des clients et prospects
├── supplier/            # Gestion des fournisseurs
├── product/             # Catalogue produits
├── product-category/    # Catégories de produits
├── company/             # Informations légales des entreprises
├── address/             # Gestion des adresses avec géolocalisation
├── contact/             # Gestion des contacts
├── auth/                # Authentification et autorisation
├── permission/          # Système de rôles et permissions
├── member/              # Gestion des membres
└── fiscal-year/         # Années fiscales
```

### 2.3 Structure d'une Feature

```
features/create-client/
├── actions/             # Server actions (mutations)
├── queries/             # Fonctions de requête (lectures)
├── components/          # Composants UI spécifiques
├── schemas/             # Validation Zod
├── types/               # Types TypeScript
└── index.ts             # Exports publics
```

---

## 3. Modules Fonctionnels

### 3.1 Module Gestion Clients

#### 3.1.1 Fonctionnalités principales

- **Types de clients** : Particuliers (`INDIVIDUAL`) ou entreprises (`COMPANY`)
- **Statuts** : Lead, Prospect, Actif, Inactif, Archivé
- **Référence unique** générée automatiquement (format CLI-XXX)
- **Informations complètes** :
  - Données personnelles (civilité, nom, prénom, fonction)
  - Informations de contact (email, téléphone, mobile, fax, site web)
  - Adresses multiples avec géolocalisation
  - Notes et informations complémentaires

#### 3.1.2 Gestion des entreprises clientes

- **Informations légales** :
  - Forme juridique (EI, EIRL, EURL, SARL, SAS, SASU, SA, etc.)
  - SIRET (14 chiffres), SIREN (9 chiffres)
  - Code APE (format 4 chiffres + 1 lettre)
  - Numéro de TVA intracommunautaire (format FR + 11 chiffres)
  - Capital social, RCS
- **Secteur d'activité** (16 secteurs disponibles)
- **Effectif** (1-2, 3-10, 11-50, 50+)
- **Contact principal** avec fonction

#### 3.1.3 Système d'adresses avancé

- **Types d'adresses** : Facturation, Livraison, Siège social, Entrepôt, Production, Commercial
- **Autocomplétion** avec API d'adresses françaises
- **Géolocalisation** automatique (latitude/longitude)
- **Support international** (40+ pays)
- **Validation** des formats d'adresse

### 3.2 Module Gestion Fournisseurs

#### 3.2.1 Fonctionnalités

- **Structure similaire aux clients** avec spécificités fournisseurs
- **Statuts spécifiques** : Actif, Inactif, En intégration, Bloqué, Archivé
- **Liaison directe** avec les produits du catalogue
- **Contacts multiples** par fournisseur
- **Référence unique** générée (format SUP-XXX)

### 3.3 Module Catalogue Produits

#### 3.3.1 Gestion des produits

- **Référence unique** générée automatiquement
- **Informations détaillées** :
  - Nom, description complète
  - Prix de vente HT et prix d'achat HT
  - Taux de TVA (20%, 10%, 5.5%, 2.1%, 0%, Exonéré)
  - Dimensions physiques (largeur, hauteur, profondeur en cm)
  - Poids en kg
- **Image principale** avec upload sécurisé
- **Statuts** : Actif, Inactif, Brouillon, Arrêté, Archivé
- **Liaison fournisseur** et catégorie

#### 3.3.2 Système de catégorisation

- **Catégories hiérarchiques** avec nom et description
- **Statuts** : Active, Archivée
- **Filtrage avancé** par catégorie, fournisseur, statut, taux de TVA
- **Recherche textuelle** sur nom et référence

### 3.4 Module Ventes (Architecture préparée)

#### 3.4.1 Processus commercial planifié

- **Devis** : Création et gestion des devis clients
- **Commandes clients** : Transformation devis en commandes
- **Factures** : Génération et suivi des factures
- **Avoirs** : Gestion des avoirs et remboursements

### 3.5 Module Administration

#### 3.5.1 Gestion des utilisateurs et permissions

- **Système de rôles** : Administrateur, Gestionnaire, Utilisateur, Lecteur
- **Permissions granulaires** par module :
  - CLIENTS_READ, CLIENTS_WRITE, CLIENTS_CREATE, CLIENTS_UPDATE, CLIENTS_DELETE
  - PRODUCTS_READ, PRODUCTS_WRITE, PRODUCTS_CREATE, PRODUCTS_UPDATE, PRODUCTS_DELETE
  - SUPPLIERS_READ, SUPPLIERS_WRITE, SUPPLIERS_CREATE, SUPPLIERS_UPDATE, SUPPLIERS_DELETE
  - Et autres permissions par domaine
- **Authentification sécurisée** avec Better Auth et passkeys
- **Gestion des sessions** avec expiration automatique

#### 3.5.2 Années fiscales

- **Gestion des exercices** comptables
- **Statuts** : Active, Clôturée, Archivée
- **Période configurable** avec dates de début/fin
- **Année courante** identifiable

---

## 4. Spécifications Techniques Détaillées

### 4.1 Base de Données (PostgreSQL)

#### 4.1.1 Modèle de données principal

```sql
-- Clients
model Client {
  id        String       @id @default(cuid())
  reference String       @unique
  type      ClientType   @default(INDIVIDUAL)
  status    ClientStatus @default(LEAD)
  // Relations avec Company, Address, Contact
}

-- Produits
model Product {
  id            String        @id @default(cuid())
  reference     String        @unique
  name          String
  price         Float         // Prix HT
  purchasePrice Float?        // Prix d'achat HT
  vatRate       VatRate       @default(STANDARD)
  // Dimensions et relations
}

-- Système de permissions
model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  isSystem    Boolean  @default(false)
}
```

#### 4.1.2 Indexation optimisée

- **Index composés** pour les requêtes fréquentes
- **Index de recherche textuelle** sur les champs principaux
- **Index de tri** par date de création/modification
- **Index de filtrage** par statut et type

### 4.2 Validation et Sécurité

#### 4.2.1 Schémas de validation Zod

```typescript
// Exemple pour la création de client
export const createClientSchema = z.object({
	reference: z.string().min(3, "Minimum 3 caractères"),
	type: z.nativeEnum(ClientType),
	companySiret: z
		.string()
		.regex(/^\d{14}$/, "14 chiffres exactement")
		.optional(),
	companySiren: z
		.string()
		.regex(/^\d{9}$/, "9 chiffres exactement")
		.optional(),
	companyVatNumber: z
		.string()
		.regex(/^FR\d{11}$/, "Format FR + 11 chiffres")
		.optional(),
	// Autres validations...
});
```

#### 4.2.2 Sécurité

- **Validation côté client et serveur** systématique
- **Protection CSRF** native Next.js
- **Sanitisation** des entrées utilisateur
- **Gestion des erreurs** centralisée et sécurisée

### 4.3 Interface Utilisateur

#### 4.3.1 Composants UI

- **Design System** basé sur Radix UI et Tailwind CSS
- **Composants réutilisables** : FormLayout, ContentCard, Autocomplete
- **Formulaires intelligents** avec TanStack Form
- **Notifications** en temps réel avec Sonner

#### 4.3.2 Fonctionnalités UX

- **Autocomplétion d'adresses** avec debouncing (500ms)
- **Génération automatique** de références
- **Validation en temps réel** des formulaires
- **Navigation breadcrumb** et sidebar organisée
- **Mode sombre/clair** automatique

### 4.4 Performance et Optimisation

#### 4.4.1 Optimisations frontend

- **Lazy loading** des composants
- **Pagination** optimisée pour les listes
- **Debouncing** des recherches
- **Cache** des données statiques

#### 4.4.2 Optimisations backend

- **Requêtes Prisma** optimisées avec includes sélectifs
- **Index de base de données** stratégiques
- **Server Actions** pour les mutations
- **Streaming** pour les réponses longues

---

## 5. Fonctionnalités Transversales

### 5.1 Recherche et Filtrage Avancé

#### 5.1.1 Moteur de recherche

- **Recherche textuelle** insensible à la casse
- **Recherche multi-champs** (nom, référence, email, téléphone)
- **Filtres combinables** par statut, type, catégorie
- **Tri** par date, nom, référence
- **Pagination** avec navigation

#### 5.1.2 Autocomplétion d'adresses

- **API d'adresses françaises** intégrée
- **Géolocalisation automatique** (latitude/longitude)
- **Validation** des codes postaux et villes
- **Support** des arrondissements parisiens

### 5.2 Gestion des Fichiers

- **Upload sécurisé** avec UploadThing
- **Validation** des types de fichiers
- **Optimisation** automatique des images
- **Stockage cloud** sécurisé

### 5.3 Internationalisation

- **Interface en français** complète
- **Support multi-pays** (40+ pays)
- **Formats locaux** : dates, devises, téléphones
- **Validation** spécifique par pays

---

## 6. Architecture de Déploiement

### 6.1 Environnements

- **Développement** : Local avec Docker
- **Staging** : Environnement de test
- **Production** : Cloud (Vercel recommandé)

### 6.2 Configuration

- **Variables d'environnement** sécurisées
- **Base de données** PostgreSQL hébergée
- **CDN** pour les assets statiques
- **Monitoring** des performances

### 6.3 Sécurité en production

- **HTTPS** obligatoire
- **Headers de sécurité** configurés
- **Rate limiting** sur les API
- **Backup** automatique des données

---

## 7. Tests et Qualité

### 7.1 Stratégie de tests

- **Tests unitaires** avec Vitest
- **Tests d'intégration** avec Testing Library
- **Tests E2E** planifiés
- **Couverture de code** suivie

### 7.2 Qualité du code

- **ESLint** et **TypeScript** strict
- **Prettier** pour le formatage
- **Husky** pour les pre-commit hooks
- **Architecture DDD** respectée

---

## 8. Maintenance et Évolution

### 8.1 Monitoring

- **Logs** structurés
- **Métriques** de performance
- **Alertes** automatiques
- **Tableau de bord** de santé

### 8.2 Évolutivité

- **Architecture modulaire** extensible
- **API** prête pour intégrations
- **Base de données** scalable
- **Code documenté** et testé

---

## 9. Roadmap Technique

### 9.1 Phase actuelle (MVP)

- ✅ Architecture DDD complète
- ✅ Modules Client/Fournisseur/Produit
- ✅ Système d'authentification
- ✅ Interface utilisateur moderne

### 9.2 Prochaines phases

- 🔄 Module de ventes (devis, factures)
- 📊 Tableaux de bord et analytics
- 📱 PWA et application mobile
- 🔗 API REST publique
- 📈 Module de reporting avancé

---

Cette architecture technique garantit une solution robuste, évolutive et maintenable pour les besoins actuels et futurs de Meubles Morinière.
