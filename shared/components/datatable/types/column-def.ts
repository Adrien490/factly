export interface ColumnDef<T> {
	id: string;
	header: string | (() => React.ReactNode);
	cell: (item: T) => React.ReactNode;
	visibility?: "always" | "tablet" | "desktop";
	align?: "left" | "center" | "right";
	sortable?: boolean;
}
