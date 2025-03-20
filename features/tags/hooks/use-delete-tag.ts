import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Tag } from "@prisma/client";
import { useActionState } from "react";
import deleteTag from "../actions/delete-tag";
import DeleteTagFormSchema from "../schemas/delete-tag-schema";

export default function useDeleteTag() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Tag, typeof DeleteTagFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await deleteTag(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
