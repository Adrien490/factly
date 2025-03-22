import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import createOrganization from "../actions/create-organization";
import OrganizationFormSchema from "../schemas/create-organization-schema";

export default function useCreateOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof OrganizationFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createOrganization(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
