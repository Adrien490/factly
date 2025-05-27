"use client";

import { useTransition } from "react";
import { useDeleteMember } from "../hooks/use-delete-member";

interface DeleteMemberButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteMemberButton({ id, children }: DeleteMemberButtonProps) {
	const { dispatch } = useDeleteMember();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
