"use client";

import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface AutocompleteProps<T> {
	name: string;
	value: string;
	onChange: (value: string) => void;
	onSelect: (item: T) => void;
	items: T[];
	getItemLabel: (item: T) => string;
	getItemDescription?: (item: T) => string | null;
	getItemImage?: (item: T) => { src: string; alt: string } | null;
	imageSize?: number;
	placeholder?: string;
	isLoading?: boolean;
	className?: string;
	inputClassName?: string;
	noResultsMessage?: string;
}

export default function Autocomplete<T>({
	name,
	value,
	onChange,
	onSelect,
	items,
	getItemLabel,
	getItemDescription,
	getItemImage,
	imageSize = 32,
	placeholder = "Rechercher...",
	isLoading = false,
	className,
	inputClassName,
	noResultsMessage = "Aucun résultat trouvé",
}: AutocompleteProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	// Gérer l'affichage des résultats
	const hasValidQuery = value.length >= 3;
	const hasResults = items.length > 0;
	const showResults = isOpen && hasValidQuery;

	// Gestion des événements
	function handleFocus() {
		if (hasValidQuery) setIsOpen(true);
	}

	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		// Vérifier si le clic est dans la liste pour éviter de la fermer trop tôt
		if (listRef.current?.contains(e.relatedTarget as Node)) return;

		// Délai court pour permettre aux clics sur les éléments de liste de se déclencher
		setTimeout(() => {
			setIsOpen(false);
		}, 100);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value);
		setIsOpen(e.target.value.length >= 3);
	}

	function handleItemSelect(item: T) {
		onSelect(item);
		setIsOpen(false);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Escape" && isOpen) {
			e.preventDefault();
			setIsOpen(false);
		} else if (e.key === "Tab" && isOpen) {
			// Ferme le menu lors de la navigation par tabulation
			setIsOpen(false);
		}
	}

	return (
		<div className={cn("relative w-full", className)}>
			<Input
				name={name}
				ref={inputRef}
				type="text"
				value={value}
				onChange={handleInputChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={cn(isLoading && "pr-10", inputClassName)}
				aria-autocomplete="list"
				aria-controls={showResults ? "autocomplete-list" : undefined}
				aria-expanded={showResults}
				autoComplete="off"
			/>

			<AnimatePresence>
				{showResults && (
					<motion.ul
						ref={listRef}
						id="autocomplete-list"
						role="listbox"
						className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md border shadow-lg py-1 text-sm focus:outline-none bg-background"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.15 }}
					>
						{isLoading ? (
							<li className="py-4 px-3 text-center">
								<div className="flex flex-col items-center justify-center gap-2">
									<Loader size="sm" variant="dots" color="primary" />
									<p className="text-sm text-muted-foreground">
										Recherche en cours...
									</p>
								</div>
							</li>
						) : hasResults ? (
							items.map((item, index) => (
								<motion.li
									key={index}
									id={`autocomplete-item-${index}`}
									role="option"
									className="cursor-pointer select-none py-1.5 px-3 hover:bg-muted"
									onClick={() => handleItemSelect(item)}
									tabIndex={-1}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: index * 0.03 }}
								>
									<div className="flex items-center gap-3">
										{getItemImage && getItemImage(item) && (
											<div className="flex-shrink-0">
												<Image
													src={getItemImage(item)!.src}
													alt={getItemImage(item)!.alt}
													width={imageSize}
													height={imageSize}
													className="object-cover rounded-sm"
												/>
											</div>
										)}
										<div className="flex flex-col min-w-0 flex-1">
											<span className="text-sm font-medium truncate">
												{getItemLabel(item)}
											</span>
											{getItemDescription && getItemDescription(item) && (
												<span className="text-xs text-muted-foreground truncate">
													{getItemDescription(item)}
												</span>
											)}
										</div>
									</div>
								</motion.li>
							))
						) : (
							<li className="py-4 px-3 text-center">
								<div className="flex flex-col items-center justify-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-muted-foreground"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p className="text-sm text-muted-foreground">
										{noResultsMessage}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										Essayez de modifier votre recherche
									</p>
								</div>
							</li>
						)}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
