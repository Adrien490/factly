"use client";

import { DotsLoader } from "@/shared/components";
import { Input } from "@/shared/components/shadcn-ui/input/input";
import { cn } from "@/shared/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAutocomplete } from "./hooks";
import { AutocompleteProps } from "./types";

export function Autocomplete<T>({
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
	minQueryLength = 3,
}: AutocompleteProps<T>) {
	// Utilisation du hook personnalisé
	const {
		showResults,
		hasResults,
		handleFocus,
		handleBlur,
		handleInputChange,
		handleItemSelect,
		handleKeyDown,
	} = useAutocomplete<T>(value, items, { minQueryLength });

	return (
		<div className={cn("relative w-full", className)}>
			<Input
				name={name}
				type="text"
				value={value}
				onChange={(e) => handleInputChange(e, onChange)}
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
									<DotsLoader size="sm" color="primary" />
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
									className="cursor-pointer select-none py-1.5 px-3 hover:bg-muted bg-card opacity-80"
									onClick={() => handleItemSelect(item, onSelect)}
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
