import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Tag } from "@prisma/client";
import { useActionState } from "react";
import createTag from "../actions/create-tag";
import createTagSchema from "../schemas/create-tag-schema";

export default function useCreateTag() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Tag, typeof createTagSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createTag(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
