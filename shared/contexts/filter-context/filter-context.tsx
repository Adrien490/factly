"use client";

import { useFilter, UseFilterOptions } from "@/shared/hooks/use-filter";
import { createContext, ReactNode, useContext } from "react";
import { FilterContextType } from "./types";

const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
	children: ReactNode;
	filterKey: string;
	options?: UseFilterOptions;
}

export function FilterProvider({
	children,
	filterKey,
	options,
}: FilterProviderProps) {
	const filter = useFilter(filterKey, options);

	return (
		<FilterContext.Provider value={filter}>{children}</FilterContext.Provider>
	);
}

export function useFilterContext() {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error(
			"useFilterContext doit être utilisé à l'intérieur d'un FilterProvider"
		);
	}
	return context;
}
