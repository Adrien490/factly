export interface SelectionContextType {
	isSelected: (id: string) => boolean;
	handleItemSelectionChange: (id: string, checked: boolean) => void;
	areAllSelected: (ids: string[]) => boolean;
	handleSelectionChange: (ids: string[], checked: boolean) => void;
	getSelectedCount: () => number;
	selectedItems: string[];
	isPending: boolean;
	clearSelection: () => void;
}
