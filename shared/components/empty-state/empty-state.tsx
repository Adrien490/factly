import { cn } from "@/shared/utils";
import { EmptyStateProps } from "./types";

export function EmptyState({
	className,
	icon: Icon,
	title,
	description,
	action,
	children,
	illustration,
	...props
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center text-center w-full p-6 bg-card rounded-lg",
				className
			)}
			{...props}
		>
			{illustration ? (
				<div className="mb-6">{illustration}</div>
			) : (
				Icon && <div className="rounded-full bg-muted/30 p-3 mb-4">{Icon}</div>
			)}

			<div className="text-lg font-medium text-foreground">{title}</div>

			{description && (
				<div className="mt-2 text-sm text-muted-foreground mx-auto max-w-2xl">
					{description}
				</div>
			)}

			{action && (
				<div className="mt-6 w-full flex justify-center">{action}</div>
			)}

			{children && <div className="mt-6 w-full">{children}</div>}
		</div>
	);
}
