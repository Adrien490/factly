import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Tag } from "@prisma/client";
import { useActionState } from "react";
import editTag from "../actions/edit-tag";
import EditTagSchema from "../schemas/edit-tag-schema";

export default function useEditTag() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Tag, typeof EditTagSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await editTag(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
