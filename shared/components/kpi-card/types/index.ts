export type KpiVariant = "default" | "success" | "warning" | "danger" | "muted";

export interface KpiCardProps {
	valuePromise: Promise<number>;
	title: string;
	icon?: React.ReactNode;
	className?: string;
	variant?: KpiVariant;
	decimalPlaces?: number;
}
