import { VariantProps } from "class-variance-authority";
import { logoBackgroundVariants, logoVariants } from "../constants";

export interface LogoProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof logoVariants>,
		Omit<VariantProps<typeof logoBackgroundVariants>, "variant"> {
	hideText?: boolean;
	text?: string;
	textSize?: "xs" | "sm" | "md" | "lg";
	textPosition?: "right" | "bottom" | "left";
	customIcon?: React.ReactNode;
	badge?: string;
	badgeColor?: "primary" | "secondary" | "accent" | "destructive" | "default";
	label?: string;
	withBorder?: boolean;
	animate?: boolean;
	srText?: string;
	href?: string;
}
