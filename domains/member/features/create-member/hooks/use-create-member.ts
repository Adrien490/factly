"use client";
import { useActionState } from "react";
import { createMember } from "../actions/create-member";

export const useCreateMember = () => {
	const [state, dispatch, isPending] = useActionState(createMember, undefined);

	return {
		state,
		dispatch,
		isPending,
	};
};
