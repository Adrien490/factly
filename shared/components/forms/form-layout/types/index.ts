import { ReactNode } from "react";

export interface FormLayoutProps {
	children: ReactNode;
	className?: string;
	columns?: 1 | 2 | 3;
	spacing?: "normal" | "compact" | "relaxed";
	withDividers?: boolean;
}
