"use client";
import { useTransition } from "react";
import { useDeleteAddress } from "../hooks";

interface DeleteAddressButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function DeleteAddressButton({
	organizationId,
	id,
	children,
}: DeleteAddressButtonProps) {
	const { dispatch } = useDeleteAddress();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
