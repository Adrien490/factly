import { cn } from "@/shared/utils";
import * as React from "react";

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className
		)}
		{...props}
	/>
);
SheetFooter.displayName = "SheetFooter";

export { SheetFooter };
