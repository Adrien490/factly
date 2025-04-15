"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, X } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { cn } from "@/shared/utils";

const TOAST_REMOVE_DELAY = 200;

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ComponentRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			"fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
			className
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border border-border bg-background text-foreground p-4 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full"
);

// Barre de progression simple

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants> & {
			showProgress?: boolean;
			duration?: number;
		}
>(({ className, children, ...props }, ref) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants(), className)}
			{...props}
		>
			<Info className="h-5 w-5 shrink-0" aria-hidden="true" />
			<div className="flex-1 overflow-hidden text-ellipsis">{children}</div>
			<ToastPrimitives.Close
				className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-1 focus:ring-ring disabled:pointer-events-none group-hover:opacity-100"
				aria-label="Fermer"
			>
				<X className="h-4 w-4" />
			</ToastPrimitives.Close>
		</ToastPrimitives.Root>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent focus:outline-hidden focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
			className
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn("text-sm font-semibold", className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn("text-sm opacity-90 leading-relaxed break-words", className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	Toast,
	TOAST_REMOVE_DELAY,
	ToastAction,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	type ToastActionElement,
	type ToastProps,
};
