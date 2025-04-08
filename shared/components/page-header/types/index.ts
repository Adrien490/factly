import { HorizontalMenuProps } from "../../horizontal-menu";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	navigation?: HorizontalMenuProps;
	action?: React.ReactNode;
	breadcrumbs?: Array<{
		label: string;
		href?: string;
	}>;
}
