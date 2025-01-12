"use client";

import { useToast } from "@/hooks/use-toast";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useEffect } from "react";
import { z } from "zod";

export function useActions<T, S extends z.ZodType>(
	state: ServerActionState<T, S> | null
) {
	const { toast } = useToast();

	useEffect(() => {
		if (!state) return;

		switch (state.status) {
			case ServerActionStatus.SUCCESS:
				toast({
					title: "Succès !",
					description: state.message,
				});
				break;

			case ServerActionStatus.ERROR:
				toast({
					title: "Erreur",
					description: state.message,
					variant: "destructive",
				});
				break;

			case ServerActionStatus.VALIDATION_ERROR:
				toast({
					title: "Erreur de validation",
					description: state.message,
					variant: "destructive",
				});
				break;

			case ServerActionStatus.UNAUTHORIZED:
				toast({
					title: "Non autorisé",
					description: state.message,
					variant: "destructive",
				});
				break;

			case ServerActionStatus.FORBIDDEN:
				toast({
					title: "Accès refusé",
					description: state.message,
					variant: "destructive",
				});
				break;

			case ServerActionStatus.NOT_FOUND:
				toast({
					title: "Non trouvé",
					description: state.message,
					variant: "destructive",
				});
				break;
		}
	}, [state, toast]);
}
