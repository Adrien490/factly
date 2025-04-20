"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils";

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				data-slot="form-item"
				className={cn("grid gap-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<Label
			data-slot="form-label"
			className={cn("data-[error=true]:text-destructive", className)}
			{...props}
		/>
	);
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
	return <Slot data-slot="form-control" {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="form-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
	const body = props.children;

	if (!body) {
		return null;
	}

	return (
		<p
			data-slot="form-message"
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{body}
		</p>
	);
}

export { FormControl, FormDescription, FormItem, FormLabel, FormMessage };
