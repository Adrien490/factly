"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

// Interface pour les options de statut
export interface FilterOption<T extends string = string> {
	label: string;
	value: T;
	variant?: "default" | "secondary" | "destructive" | "outline";
	description?: string;
	icon?: React.ReactNode;
}

// Interface pour les props du composant
export interface DropdownMenuFilterProps<T extends string = string> {
	/** Options de filtre à afficher dans le menu déroulant */
	options: FilterOption<T>[];

	/** Étiquette à afficher devant le sélecteur */
	label?: string;

	/** Paramètre d'URL à utiliser pour stocker la valeur */
	paramName?: string;

	/** Valeur par défaut si aucune n'est présente dans l'URL */
	defaultValue?: T;

	/** Classes CSS supplémentaires pour le conteneur */
	className?: string;

	/** Afficher une option "Tous" */
	showAllOption?: boolean;

	/** Libellé de l'option "Tous" */
	allOptionLabel?: string;

	/** Placeholder à afficher quand aucune valeur n'est sélectionnée */
	placeholder?: string;
}

/**
 * Composant de filtre dropdown générique qui met à jour l'URL
 * Un composant générique pour créer des filtres dans l'interface utilisateur
 * qui sont synchronisés avec les paramètres d'URL.
 */
export default function DropdownMenuFilter<T extends string = string>({
	options,
	label,
	paramName = "filter",
	className = "",
	showAllOption = true,
	allOptionLabel = "Tous",
	placeholder = "Filtrer",
}: DropdownMenuFilterProps<T>) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer la valeur active depuis l'URL
	// Important: On utilise null si le paramètre n'existe pas dans l'URL
	// pour bien distinguer "pas de paramètre" (tous) de "paramètre avec valeur par défaut"
	const urlValue = searchParams.get(paramName);
	const initialValue = urlValue !== null ? (urlValue as T) : ("" as T);

	// Utiliser useOptimistic avec le bon typage
	const [optimisticValue, setOptimisticValue] = useOptimistic<T | "", T | "">(
		initialValue,
		(_state: T | "", newValue: T | "") => newValue
	);

	// Obtenir l'option correspondant à la valeur actuelle
	const getCurrentOption = (): FilterOption<T> | undefined => {
		if (!optimisticValue && showAllOption) {
			return { label: allOptionLabel, value: "" as T };
		}
		return options.find(
			(opt: FilterOption<T>) => opt.value === optimisticValue
		);
	};

	// Obtenir le libellé de l'option actuelle
	const getCurrentLabel = () => {
		const option = getCurrentOption();
		return (
			option?.label ||
			(showAllOption ? allOptionLabel : options[0]?.label || placeholder)
		);
	};

	// Mettre à jour le filtre
	const handleFilterChange = (value: T | "") => {
		// Créer une nouvelle instance de URLSearchParams basée sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		// Mettre à jour ou supprimer le paramètre
		if (value) {
			params.set(paramName, value);
		} else {
			// Quand on sélectionne "Tous", on supprime complètement le paramètre
			params.delete(paramName);
		}

		// Mise à jour de l'état optimistic et de l'URL dans la même transition
		startTransition(() => {
			// Mettre à jour l'état optimistic avec la valeur sélectionnée
			// Important: pour "Tous", on utilise explicitement "" et non defaultValue
			setOptimisticValue(value);

			// Mise à jour de l'URL sans rechargement de la page
			router.replace(`?${params.toString()}`);
		});
	};

	// Couleur de badge pour l'option actuelle
	const getBadgeVariant = () => {
		const option = getCurrentOption();
		return option?.variant || "secondary";
	};

	// Générer les options du menu déroulant
	const menuItems = [
		...(showAllOption
			? [
					<DropdownMenuItem
						key="all"
						onClick={() => handleFilterChange("" as T)}
						className="justify-between"
						data-state={!optimisticValue ? "active" : undefined}
					>
						{allOptionLabel}
					</DropdownMenuItem>,
			  ]
			: []),
		...options.map((option) => (
			<DropdownMenuItem
				key={option.value}
				onClick={() => handleFilterChange(option.value)}
				className="justify-between"
				data-state={optimisticValue === option.value ? "active" : undefined}
			>
				<div className="flex items-center gap-2">
					{option.icon && <div className="shrink-0">{option.icon}</div>}
					<span>{option.label}</span>
				</div>

				{optimisticValue === option.value && (
					<Badge variant={option.variant || "secondary"} className="ml-2">
						{option.label}
					</Badge>
				)}
			</DropdownMenuItem>
		)),
	];

	return (
		<div
			className={`flex items-center gap-1 ${className}`}
			data-pending={isPending ? "" : undefined}
		>
			{label && (
				<span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">
					{label} :
				</span>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="gap-1 h-9 min-w-[140px] justify-between"
						disabled={isPending}
					>
						{optimisticValue ? (
							<Badge variant={getBadgeVariant()} className="mr-1">
								{getCurrentLabel()}
							</Badge>
						) : (
							<span className="truncate">{getCurrentLabel()}</span>
						)}
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[200px]">
					{menuItems}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
