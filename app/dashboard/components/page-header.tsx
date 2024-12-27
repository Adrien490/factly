"use client";

import { Breadcrumb } from "@/app/dashboard/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface PageHeaderProps {
	title: string;
	description?: string;
	breadcrumbItems: Array<{ label: string; href: string }>;
	actions?: ReactNode;
	className?: string;
	defaultExpanded?: boolean;
}

export function PageHeader({
	title,
	description,
	breadcrumbItems,
	actions,
	className,
	defaultExpanded = true,
}: PageHeaderProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const isMobile = useIsMobile();

	const toggleButton = (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => setIsExpanded(!isExpanded)}
			className={cn(
				"relative p-0 h-6 w-6 rounded-full hover:bg-transparent",
				"after:absolute after:inset-0 after:rounded-full after:border",
				"after:border-border/50 after:opacity-0 hover:after:opacity-100",
				"after:transition-opacity after:duration-200"
			)}
		>
			<ChevronDown
				className={cn(
					"h-4 w-4 text-muted-foreground transition-transform duration-200",
					isExpanded ? "transform rotate-0" : "transform rotate-180"
				)}
			/>
			<span className="sr-only">
				{isExpanded ? "Collapse header" : "Expand header"}
			</span>
		</Button>
	);

	const headerContent = (
		<div className="space-y-2">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
					{title}
				</h1>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>
			<motion.div
				initial={false}
				animate={{
					height: isExpanded || !isMobile ? "auto" : 0,
					opacity: isExpanded || !isMobile ? 1 : 0,
				}}
				transition={{ duration: 0.2 }}
				className="overflow-hidden"
			>
				<Breadcrumb
					items={breadcrumbItems}
					className="text-sm text-muted-foreground"
				/>
			</motion.div>
		</div>
	);

	const actionsContent = actions && (
		<motion.div
			initial={false}
			animate={{
				height: isExpanded || !isMobile ? "auto" : 0,
				opacity: isExpanded || !isMobile ? 1 : 0,
			}}
			transition={{ duration: 0.2 }}
			className={cn(
				"overflow-hidden",
				isMobile
					? "flex flex-col gap-3"
					: "flex items-center gap-3 min-w-[300px]"
			)}
		>
			{actions}
		</motion.div>
	);

	return (
		<div
			className={cn(
				"relative border-b pb-6 pt-2",

				className
			)}
		>
			{isMobile ? (
				<div className="space-y-4">
					<div className="flex items-start justify-between">
						{headerContent}
						{toggleButton}
					</div>
					{actionsContent}
				</div>
			) : (
				<div className="flex items-start justify-between gap-8">
					{headerContent}
					{actionsContent}
				</div>
			)}
		</div>
	);
}
