export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	action?: React.ReactNode;
	breadcrumbs?: Array<{
		label: string;
		href?: string;
	}>;
}
