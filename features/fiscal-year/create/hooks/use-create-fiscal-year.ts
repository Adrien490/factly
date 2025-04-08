import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { FiscalYear } from "@prisma/client";
import { useActionState } from "react";
import { createFiscalYearSchema } from "../schemas";
import { createFiscalYear } from "../utils/create-fiscal-year";

export function useCreateFiscalYear() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<FiscalYear, typeof createFiscalYearSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createFiscalYear(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
