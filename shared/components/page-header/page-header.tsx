interface PageHeaderProps {
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
	return (
		<div className="pt-4 space-y-4 mb-4">
			<div className="flex flex-col gap-1.5">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="space-y-1.5">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{title}
						</h1>
						{description && (
							<h2 className="text-sm text-muted-foreground sm:text-base max-w-prose">
								{description}
							</h2>
						)}
					</div>

					{action && (
						<div className="md:ml-auto flex items-center shrink-0">
							{action}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
