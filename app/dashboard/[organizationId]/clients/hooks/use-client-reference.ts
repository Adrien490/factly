"use client";

import checkClientReference from "@/app/dashboard/[organizationId]/clients/server/check-client-reference";
import { generateReference } from "@/app/dashboard/[organizationId]/clients/server/generate-reference";
import { useToast } from "@/hooks/use-toast";
import { ServerActionStatus } from "@/types/server-action";
import { useParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
type ReferenceState = {
	reference: string;
	exists: boolean;
	status: ServerActionStatus | null;
};

export function useClientReference() {
	const [isPending, startTransition] = useTransition();
	const { organizationId } = useParams<{ organizationId: string }>();
	const [optimisticReference, setOptimisticReference] =
		useOptimistic<ReferenceState>({
			reference: "",
			exists: false,
			status: null,
		});
	const { toast } = useToast();

	const checkReference = useDebouncedCallback(async (reference: string) => {
		if (!reference) return;

		const formData = new FormData();
		formData.append("reference", reference);
		formData.append("organizationId", organizationId);

		try {
			const result = await checkClientReference(null, formData);
			if (result.status === ServerActionStatus.SUCCESS) {
				startTransition(() => {
					setOptimisticReference(() => ({
						reference: result.data?.reference ?? "",
						exists: result.data?.exists ?? false,
						status: ServerActionStatus.SUCCESS,
					}));
				});
			}
		} catch {
			toast({
				title: "Erreur",
				description: "Impossible de vérifier la référence",
				variant: "destructive",
			});
		}
	}, 500);

	const generateClientReference = async () => {
		try {
			const reference = await generateReference({
				format: "alphanumeric",
				length: 3,
			});
			if (reference) {
				startTransition(() =>
					setOptimisticReference(() => ({
						reference,
						exists: false,
						status: ServerActionStatus.SUCCESS,
					}))
				);
				checkReference(reference);
				return reference;
			}
		} catch (error) {
			toast({
				title: "Erreur",
				description: error instanceof Error ? error.message : "Erreur inconnue",
				variant: "destructive",
			});
		}
	};

	return {
		isPending,
		optimisticReference,
		checkReference,
		generateClientReference,
	};
}
