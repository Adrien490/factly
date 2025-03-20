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

### Appel direct à l'API

Pour appeler directement l'API d'adresse, vous pouvez utiliser la fonction `searchAddress` :

```tsx
import { searchAddress } from "@/features/address-autocomplete/queries/search-address";

async function fetchAddresses(query: string) {
	try {
		const results = await searchAddress({ query });
		console.log(results);
	} catch (error) {
		console.error("Erreur lors de la recherche :", error);
	}
}
```

## Structure des données

Les résultats retournés sont de type `FormattedAddressResult` et contiennent les propriétés suivantes :

```typescript
interface FormattedAddressResult {
	label: string; // Adresse complète
	value: string; // Adresse complète (identique à label)
	city: string; // Ville
	postcode: string; // Code postal
	street?: string; // Rue
	housenumber?: string; // Numéro de rue
	coordinates: [number, number]; // Coordonnées [longitude, latitude]
}
```

## Intégration avec create-client-form

Pour intégrer l'autocomplétion d'adresse dans le formulaire de création de client, suivez l'exemple ci-dessous :

```tsx
// Dans features/clients/components/create-client-form.tsx
import { useAddressAutocomplete } from "@/features/address-autocomplete/hooks/use-address-autocomplete";

// Dans le composant CreateClientForm
const { inputValue, setInputValue, results, isLoading, selectResult } =
	useAddressAutocomplete();

// Ajouter dans le rendu du formulaire :
<FormField
	control={form.control}
	name="address"
	render={({ field }) => (
		<FormItem>
			<FormLabel>Adresse</FormLabel>
			<FormControl>
				<div className="relative">
					<Input
						placeholder="Saisissez une adresse"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onBlur={field.onBlur}
					/>
					{results.length > 0 && (
						<div className="absolute z-10 w-full bg-background border rounded-md shadow-md mt-1">
							{results.map((result) => (
								<div
									key={result.label}
									className="p-2 hover:bg-accent cursor-pointer"
									onClick={() => {
										selectResult(result);
										form.setValue("address", result.label);
										form.setValue("city", result.city);
										form.setValue("postalCode", result.postcode);
									}}
								>
									{result.label}
								</div>
							))}
						</div>
					)}
				</div>
			</FormControl>
			<FormDescription>Saisissez l'adresse du client</FormDescription>
			<FormMessage />
		</FormItem>
	)}
/>;
```

## Crédits

Ce module utilise l'API Adresse de la Base Adresse Nationale (BAN), qui est la base officielle des adresses en France. Pour plus d'informations, consultez la [documentation de l'API](https://adresse.data.gouv.fr/api-doc/adresse).
