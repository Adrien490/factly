import { Button } from "@/shared/components";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ClientNotFoundProps {
	organizationId: string;
}

export function ClientNotFound({ organizationId }: ClientNotFoundProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="rounded-full bg-destructive/10 p-3 mb-4">
				<AlertCircle className="h-6 w-6 text-destructive" />
			</div>
			<h1 className="text-2xl font-semibold tracking-tight mb-2">
				Client introuvable
			</h1>
			<p className="text-muted-foreground max-w-md mb-6">
				Ce client n&apos;existe pas ou a peut-être été supprimé. Vérifiez que
				vous avez accès à ce client ou qu&apos;il n&apos;a pas été retiré de
				votre organisation.
			</p>
			<Button asChild>
				<Link href={`/dashboard/${organizationId}/clients`}>
					Retour à la liste des clients
				</Link>
			</Button>
		</div>
	);
}
