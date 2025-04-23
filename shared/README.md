# Shared

Ce répertoire contient toutes les ressources partagées de l'application, organisées par catégories pour faciliter la réutilisation, la maintenance et garantir la cohérence dans l'ensemble du projet.

## Structure du répertoire

| Dossier       | Description                           |
| ------------- | ------------------------------------- |
| `/components` | Composants React réutilisables        |
| `/hooks`      | Hooks React personnalisés             |
| `/utils`      | Fonctions utilitaires                 |
| `/types`      | Définitions de types TypeScript       |
| `/constants`  | Constantes et valeurs statiques       |
| `/styles`     | Styles partagés et thèmes             |
| `/lib`        | Bibliothèques et intégrations tierces |

## Bonnes pratiques

1. **Réutilisabilité**: Tous les éléments partagés doivent être conçus pour être réutilisables
2. **Minimalisme**: Évitez les dépendances inutiles entre les éléments partagés
3. **Documentation**: Chaque élément majeur doit être documenté
4. **Typages**: Utilisez TypeScript pour tous les éléments partagés
5. **Tests**: Couvrez les éléments partagés avec des tests unitaires
6. **Isolation**: Évitez les références aux éléments spécifiques à l'application

## Comment contribuer

Pour ajouter un nouvel élément partagé:

1. Identifiez la catégorie appropriée
2. Suivez les conventions de nommage existantes
3. Documentez l'utilisation et les API
4. Ajoutez des types TypeScript complets
5. Vérifiez les dépendances pour éviter les imports circulaires
6. Testez l'élément dans différents contextes
7. Mettez à jour ce README si nécessaire
