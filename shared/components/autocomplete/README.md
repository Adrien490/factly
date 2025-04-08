# Module d'autocomplétion d'adresse

Ce module permet d'intégrer facilement l'autocomplétion d'adresses françaises dans les formulaires de l'application, en utilisant l'API Adresse de la Base Adresse Nationale (BAN).

## Configuration

### Variables d'environnement

Le module utilise une variable d'environnement pour l'URL de l'API :

```
NEXT_PUBLIC_BASE_ADRESSE_API_URL="https://api-adresse.data.gouv.fr/search/"
```

Cette variable est déjà configurée dans le fichier `.env` à la racine du projet.

## Utilisation

### Dans un formulaire React

Pour utiliser l'autocomplétion d'adresse dans un formulaire, vous pouvez utiliser le hook `useAddressAutocomplete` :

```tsx
import { useAddressAutocomplete } from "@/features/address-autocomplete/hooks/use-address-autocomplete";

function AddressForm() {
	const { inputValue, setInputValue, results, isLoading, error, selectResult } =
		useAddressAutocomplete();

	return (
		<div>
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="Rechercher une adresse..."
			/>

			{isLoading && <p>Chargement...</p>}

			{results.length > 0 && (
				<ul>
					{results.map((result) => (
						<li key={result.label} onClick={() => selectResult(result)}>
							{result.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
```
