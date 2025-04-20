"use client";

import { Button } from "@/shared/components";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export type ErrorPageProps = {
	title: string;
	message: string;
	icon?: React.ReactNode;
	actions?: React.ReactNode;
	showHomeButton?: boolean;
};

export function ErrorPage({
	title,
	message,
	icon,
	actions,
	showHomeButton = true,
}: ErrorPageProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="mx-auto max-w-md px-6 py-12 text-center">
				<div className="flex justify-center">{icon}</div>
				<h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1>
				<p className="mt-4 text-base text-muted-foreground">{message}</p>
				<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
					{actions}
					{showHomeButton && (
						<Button asChild>
							<Link href="/" className="flex items-center gap-2">
								<HomeIcon className="h-4 w-4" />
								Accueil
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
