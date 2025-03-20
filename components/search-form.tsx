"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader } from "./loader";

type SearchFormProps = {
	paramName: string; // Le nom du paramètre de recherche à gérer
	className?: string;
	placeholder?: string;
};

const SearchForm = ({ paramName, className, placeholder }: SearchFormProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Récupérer la valeur initiale du paramètre de recherche
	const initialSearchValue = searchParams.get(paramName) || "";

	// Configuration du formulaire avec TanStack Form
	const form = useForm({
		defaultValues: {
			searchTerm: initialSearchValue,
		},
	});

	// Mettre à jour les paramètres d'URL lorsque la recherche change
	const updateSearchParams = (searchTerm: string) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (searchTerm) {
			newSearchParams.set(paramName, searchTerm);
		} else {
			newSearchParams.delete(paramName);
		}

		startTransition(() => {
			router.replace(`?${newSearchParams.toString()}`, { scroll: false });
		});
	};

	// Effacer la recherche
	const clearSearch = () => {
		form.setFieldValue("searchTerm", "");
		updateSearchParams("");
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className={cn("relative flex w-full items-center gap-2", className)}
			data-pending={isPending ? "" : undefined}
		>
			<div className="absolute left-5 flex items-center">
				{isPending ? (
					<Loader size="sm" />
				) : (
					<Search className="text-muted-foreground h-4 w-4" />
				)}
			</div>

			<form.Field
				name="searchTerm"
				validators={{
					onChangeAsyncDebounceMs: 300, // Debounce de 300ms
					onChangeAsync: async ({ value }) => {
						updateSearchParams(value);
						return undefined;
					},
				}}
			>
				{(field) => (
					<Input
						autoComplete="off"
						type="text"
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						className="pl-12 truncate h-9"
						placeholder={placeholder || "Rechercher..."}
						aria-label="Champ de recherche"
					/>
				)}
			</form.Field>

			<Button
				type="button"
				className="absolute right-0 hover:bg-transparent"
				variant="ghost"
				onClick={clearSearch}
				aria-label="Effacer la recherche"
			>
				<X className="h-4 w-4 text-muted-foreground" />
			</Button>
		</form>
	);
};

export function SearchFormSkeleton() {
	return <Skeleton className="h-10 w-full" />;
}

export default SearchForm;
