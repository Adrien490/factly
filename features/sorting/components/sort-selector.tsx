"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

// Interface pour les options de tri
export interface SortOption {
	label: string; // Libellé affiché à l'utilisateur
	value: string; // Valeur passée à l'API
}

interface SortSelectorProps {
	options: SortOption[]; // Options de tri disponibles
	paramName?: string; // Nom du paramètre d'URL pour le tri (sortBy par défaut)
	orderParamName?: string; // Nom du paramètre d'URL pour l'ordre (sortOrder par défaut)
	defaultValue?: string; // Valeur par défaut
	defaultOrder?: "asc" | "desc"; // Ordre par défaut
	className?: string; // Classes CSS additionnelles
}

export default function SortSelector({
	options,
	paramName = "sortBy",
	orderParamName = "sortOrder",
	defaultValue = options[0]?.value,
	defaultOrder = "asc",
	className,
}: SortSelectorProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer la valeur active depuis l'URL ou utiliser la valeur par défaut
	const initialValue = searchParams.get(paramName) || defaultValue;
	const initialOrder =
		(searchParams.get(orderParamName) as "asc" | "desc") || defaultOrder;

	// Utiliser useState au lieu de useOptimistic pour éviter les erreurs
	const [currentValue, setCurrentValue] = useState(initialValue);
	const [currentOrder, setCurrentOrder] = useState<"asc" | "desc">(
		initialOrder
	);

	// Trouver le libellé correspondant à la valeur actuelle
	const getCurrentLabel = () => {
		const option = options.find((opt) => opt.value === currentValue);
		return option?.label || options[0]?.label || "Trier par";
	};

	// Mettre à jour la valeur de tri
	const handleSortChange = (value: string) => {
		// Mettre à jour l'état local immédiatement
		setCurrentValue(value);

		// Créer une nouvelle instance de URLSearchParams basée sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		// Mettre à jour ou ajouter le paramètre de tri
		params.set(paramName, value);

		// Mise à jour de l'URL avec le nouveau paramètre sans rechargement de la page
		startTransition(() => {
			router.replace(`?${params.toString()}`, { scroll: false });
		});
	};

	// Basculer l'ordre de tri
	const toggleSortOrder = () => {
		const newOrder = currentOrder === "asc" ? "desc" : "asc";

		// Mettre à jour l'état local immédiatement
		setCurrentOrder(newOrder);

		// Créer une nouvelle instance de URLSearchParams basée sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		// Mettre à jour ou ajouter le paramètre d'ordre
		params.set(orderParamName, newOrder);

		// Mise à jour de l'URL avec le nouveau paramètre sans rechargement de la page
		startTransition(() => {
			router.replace(`?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div
			className={`flex items-center gap-1 ${className}`}
			data-pending={isPending ? "" : undefined}
		>
			<span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">
				Trier par :
			</span>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="gap-1 h-9 min-w-[120px] justify-between"
						disabled={isPending}
					>
						<span className="truncate">{getCurrentLabel()}</span>
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[180px]">
					{options.map((option) => (
						<DropdownMenuItem
							key={option.value}
							onClick={() => handleSortChange(option.value)}
							className="justify-between"
							data-state={currentValue === option.value ? "active" : undefined}
						>
							{option.label}
							{currentValue === option.value &&
								(currentOrder === "asc" ? (
									<SortAsc className="h-4 w-4 ml-2" />
								) : (
									<SortDesc className="h-4 w-4 ml-2" />
								))}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<Button
				variant="outline"
				size="icon"
				className="h-9 w-9"
				onClick={toggleSortOrder}
				disabled={isPending}
				title={
					currentOrder === "asc"
						? "Trier par ordre décroissant"
						: "Trier par ordre croissant"
				}
			>
				{currentOrder === "asc" ? (
					<SortAsc className="h-4 w-4" />
				) : (
					<SortDesc className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
}
