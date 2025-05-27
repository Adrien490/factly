"use client";
import { useTransition } from "react";
import { useDeleteAddress } from "../hooks";

interface DeleteAddressButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteAddressButton({
	id,
	children,
}: DeleteAddressButtonProps) {
	const { dispatch } = useDeleteAddress();

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
