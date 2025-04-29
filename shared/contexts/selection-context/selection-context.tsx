"use client";

import { useSelection } from "@/shared/hooks/use-selection";
import { ReactNode, createContext, useContext } from "react";

type SelectionContextType = ReturnType<typeof useSelection>;

const SelectionContext = createContext<SelectionContextType | null>(null);

interface SelectionProviderProps {
	children: ReactNode;
	selectionKey?: string;
}

export function SelectionProvider({
	children,
	selectionKey = "selected",
}: SelectionProviderProps) {
	const selection = useSelection(selectionKey);

	return (
		<SelectionContext.Provider value={selection}>
			{children}
		</SelectionContext.Provider>
	);
}

export function useSelectionContext() {
	const context = useContext(SelectionContext);
	if (!context) {
		throw new Error(
			"useSelectionContext doit être utilisé à l'intérieur d'un SelectionProvider"
		);
	}
	return context;
}
