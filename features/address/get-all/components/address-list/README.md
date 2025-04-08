# Address List Component

Un composant pour afficher une liste d'adresses avec deux modes de vue (grille et liste), inspiré du composant organization-list.

## Caractéristiques

- Affichage des adresses en mode grille ou liste
- Possibilité de marquer une adresse comme principale
- Menu d'actions pour chaque adresse (éditer, définir comme principale, supprimer)
- État vide personnalisable lorsqu'aucune adresse n'est disponible
- Support pour la création d'une nouvelle adresse via onClick ou href

## Utilisation

```tsx
"use client";

import { getAddresses } from "@/features/address/get-all";
import { AddressList } from "@/features/address/components/address-list";
import { ViewToggle } from "@/shared/components/view-toggle";

export default function AddressesPage() {
	// Créer une promise pour récupérer les adresses
	const addressesPromise = getAddresses({
		// paramètres optionnels de filtrage
	});

	return (
		<div>
			<div className="flex justify-between mb-4">
				<h1 className="text-2xl font-bold">Adresses</h1>
				<ViewToggle />
			</div>

			<AddressList
				addressesPromise={addressesPromise}
				createHref="/dashboard/addresses/new"
				// Ou utiliser un gestionnaire d'événements
				// onCreateClick={() => handleCreateClick()}
			/>
		</div>
	);
}
```

## Props

### AddressList

| Prop               | Type                          | Description                                                              |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------ |
| `addressesPromise` | `Promise<GetAddressesReturn>` | Promise qui résout vers un tableau d'adresses                            |
| `onCreateClick`    | `() => void`                  | Fonction appelée lors du clic sur le bouton "Nouvelle adresse"           |
| `createHref`       | `string`                      | URL vers laquelle naviguer lors du clic sur le bouton "Nouvelle adresse" |

### AddressCard

| Prop       | Type                    | Description              |
| ---------- | ----------------------- | ------------------------ |
| `address`  | `GetAddressesReturn[0]` | Objet adresse à afficher |
| `viewMode` | `"grid" \| "list"`      | Mode d'affichage         |
