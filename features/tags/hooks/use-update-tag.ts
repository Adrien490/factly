import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Tag } from "@prisma/client";
import { useActionState } from "react";
import updateTag from "../actions/update-tag";
import TagFormSchema from "../schemas/create-tag-schema";

export default function useUpdateTag() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Tag, typeof TagFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateTag(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
