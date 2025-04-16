"use client";

import { SelectionProviderProps } from "./types";

export function SelectionProvider({
	children,
	selectionKey = "selected",
}: SelectionProviderProps) {
	return (
		<SelectionProvider selectionKey={selectionKey}>
			{children}
		</SelectionProvider>
	);
}
