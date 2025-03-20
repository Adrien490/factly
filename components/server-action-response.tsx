"use client";

import { useToast } from "@/hooks/use-toast";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useEffect } from "react";
import { z } from "zod";

interface ServerActionResponseProps<TData, TSchema extends z.ZodType> {
	state: ServerActionState<TData, TSchema> | null;
}

export default function ServerActionResponse<TData, TSchema extends z.ZodType>({
	state,
}: ServerActionResponseProps<TData, TSchema>) {
	const { toast } = useToast();

	useEffect(() => {
		if (!state) return;

		switch (state.status) {
			case ServerActionStatus.SUCCESS:
				toast({
					title: "Succès",
					description: state.message,
				});
				break;
			case ServerActionStatus.ERROR:
			case ServerActionStatus.UNAUTHORIZED:
			case ServerActionStatus.FORBIDDEN:
			case ServerActionStatus.NOT_FOUND:
			case ServerActionStatus.CONFLICT:
				toast({
					title: "Erreur",
					description: state.message,
				});
				break;
			case ServerActionStatus.VALIDATION_ERROR:
				toast({
					title: state.message,
					description: state.validationErrors
						? Object.entries(state.validationErrors)
								.map(([, errors]) => `${errors?.join(", ")}`)
								.join("\n")
						: "",
				});
				break;
		}
	}, [state, toast]);

	return null;
}
