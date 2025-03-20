"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PricingPlan from "../types/pricing-plan";

interface PricingItemProps {
	plan: PricingPlan;
	billingPeriod?: "monthly" | "yearly";
	className?: string;
	showPopularBadge?: boolean;
}

export function PricingItem({
	plan,
	billingPeriod = "monthly",
	className,
	showPopularBadge = true,
}: PricingItemProps) {
	return (
		<motion.div
			whileHover={{
				y: plan.popular ? -4 : -8,
				transition: { duration: 0.2 },
			}}
			className={cn(
				"flex flex-col h-full",
				plan.popular && "md:-mt-4 md:mb-4",
				className
			)}
		>
			<Card
				className={cn(
					"relative h-full border-border transition-all duration-200",
					plan.popular
						? "border-primary/30 shadow-lg shadow-primary/5"
						: "hover:border-primary/20 hover:shadow-md"
				)}
			>
				{plan.popular && showPopularBadge && (
					<div className="absolute -top-3 inset-x-0 flex justify-center">
						<Badge
							variant="default"
							className="px-3 py-1 bg-primary text-primary-foreground font-medium"
						>
							Recommandé
						</Badge>
					</div>
				)}

				<CardHeader
					className={cn("text-center pt-8 pb-6", plan.popular && "pb-8")}
				>
					<h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
					<div className="mb-2">
						<span className="text-3xl font-bold">
							{billingPeriod === "monthly"
								? plan.price.monthly
								: plan.price.yearly}
						</span>
						<span className="text-muted-foreground ml-1">
							{billingPeriod === "monthly" ? "/mois" : "/an"}
						</span>
					</div>
					<p className="text-sm text-muted-foreground">{plan.description}</p>
				</CardHeader>

				<CardContent className="grow">
					<ul className="space-y-3">
						{plan.features.map((feature, idx) => (
							<li key={idx} className="flex items-start gap-2">
								<Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
								<span className="text-sm">{feature}</span>
							</li>
						))}
					</ul>
				</CardContent>

				<CardFooter className="pt-4 pb-8">
					<Button
						asChild
						variant={plan.popular ? "default" : "outline"}
						className={cn(
							"w-full group",
							plan.popular
								? "bg-primary hover:bg-primary/90"
								: "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
						)}
					>
						<Link href={plan.cta.href}>
							{plan.cta.label}
							<ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
