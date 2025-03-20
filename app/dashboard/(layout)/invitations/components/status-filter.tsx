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
export interface StatusOption {
	label: string;
	value: string;
	variant?: "default" | "secondary" | "destructive" | "outline";
	description?: string;
}

interface StatusFilterProps {
	options?: StatusOption[];
	paramName?: string;
	defaultValue?: string;
	className?: string;
	showAllOption?: boolean;
}

export default function StatusFilter({
	options,
	paramName = "status",
	defaultValue = "",
	className,
	showAllOption = true,
}: StatusFilterProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer la valeur active depuis l'URL ou utiliser la valeur par défaut
	const initialValue = searchParams.get(paramName) || defaultValue;

	// Utiliser useOptimistic avec le bon typage
	const [optimisticValue, setOptimisticValue] = useOptimistic<string, string>(
		initialValue || "",
		(_state, newValue) => newValue
	);

	// Obtenir l'option correspondant à la valeur actuelle
	const getCurrentOption = (): StatusOption | undefined => {
		if (!optimisticValue && showAllOption) {
			return { label: "Tous les statuts", value: "" };
		}
		return options?.find((opt) => opt.value === optimisticValue);
	};

	// Obtenir le libellé de l'option actuelle
	const getCurrentLabel = () => {
		const option = getCurrentOption();
		return (
			option?.label ||
			(showAllOption ? "Tous les statuts" : options?.[0]?.label || "Statut")
		);
	};

	// Mettre à jour le filtre de statut
	const handleStatusChange = (value: string) => {
		// Créer une nouvelle instance de URLSearchParams basée sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		// Mettre à jour ou supprimer le paramètre de statut
		if (value) {
			params.set(paramName, value);
		} else {
			params.delete(paramName);
		}

		// Mise à jour de l'état optimistic et de l'URL dans la même transition
		startTransition(() => {
			// Mettre à jour l'état optimistic
			setOptimisticValue(value);

			// Mise à jour de l'URL sans rechargement de la page
			router.replace(`?${params.toString()}`, { scroll: false });
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
						onClick={() => handleStatusChange("")}
						className="justify-between"
						data-state={!optimisticValue ? "active" : undefined}
					>
						Tous les statuts
					</DropdownMenuItem>,
			  ]
			: []),
		...(options?.map((option) => (
			<DropdownMenuItem
				key={option.value}
				onClick={() => handleStatusChange(option.value)}
				className="justify-between"
				data-state={optimisticValue === option.value ? "active" : undefined}
			>
				{option.label}
				{optimisticValue === option.value && (
					<Badge variant={option.variant || "secondary"} className="ml-2">
						{option.label}
					</Badge>
				)}
			</DropdownMenuItem>
		)) ?? []),
	];

	return (
		<div
			className={`flex items-center gap-1 ${className}`}
			data-pending={isPending ? "" : undefined}
		>
			<span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">
				Statut :
			</span>
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
