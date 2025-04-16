export interface SelectionContextType {
	isSelected: (id: string) => boolean;
	handleItemSelectionChange: (id: string, checked: boolean) => void;
	areAllSelected: (ids: string[]) => boolean;
	handleSelectionChange: (ids: string[], checked: boolean) => void;
	getSelectedCount: () => number;
	isPending: boolean;
	clearSelection: () => void;
}
