"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ServerActionStatus } from "@/types/server-action";
import { Loader2, RotateCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import refreshClients from "../server/refresh-clients";

export default function RefreshButton() {
	const { toast } = useToast();
	const params = useParams();
	const { organizationId } = params;
	const [state, formAction, isPending] = useActionState(refreshClients, null);
	useEffect(() => {
		if (state?.status === ServerActionStatus.SUCCESS) {
			toast({
				title: "Clients actualisés",
				description: "Les clients ont été actualisés avec succès",
			});
		} else if (state?.status === ServerActionStatus.ERROR) {
			toast({
				title: "Erreur",
				description: state.message,
				variant: "destructive",
			});
		} else if (state?.status === ServerActionStatus.VALIDATION_ERROR) {
			toast({
				title: "Erreur",
				description: state.validationErrors?.organizationId?.[0],
				variant: "destructive",
			});
		}
	}, [state, toast]);
	console.log(state);
	return (
		<form action={formAction}>
			<input type="hidden" name="organizationId" value={organizationId} />
			<Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
				{isPending ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<RotateCw className="mr-2 h-4 w-4" />
				)}
				Actualiser
			</Button>
		</form>
	);
}
