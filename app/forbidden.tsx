import { Button } from "@/shared/components/ui/button";
import { HomeIcon, ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="mx-auto max-w-md px-6 py-12 text-center">
				<div className="flex justify-center">
					<ShieldAlertIcon className="h-16 w-16 text-destructive" />
				</div>
				<h1 className="mt-6 text-3xl font-bold tracking-tight">Accès refusé</h1>
				<p className="mt-4 text-base text-muted-foreground">
					Vous n&apos;avez pas les autorisations nécessaires pour accéder à
					cette page.
				</p>
				<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button asChild>
						<Link href="/" className="flex items-center gap-2" replace>
							<HomeIcon className="h-4 w-4" />
							Accueil
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
