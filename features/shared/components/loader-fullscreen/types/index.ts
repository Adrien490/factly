import { LoaderProps } from "../../loader/types";

export interface LoaderFullscreenProps
	extends Omit<LoaderProps, "align" | "className"> {
	overlayColor?: string;
	zIndex?: number;
	showCloseButton?: boolean;
	onClose?: () => void;
	className?: string;
	transitionDuration?: number;
	blurStrength?: number;
	showProgressBar?: boolean;
}
