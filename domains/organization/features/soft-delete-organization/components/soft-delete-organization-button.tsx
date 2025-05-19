"use client";

import { useTransition } from "react";
import { useSoftDeleteOrganization } from "../hooks/use-soft-delete-organization";

interface SoftDeleteOrganizationButtonProps {
	id: string;
	confirmation: string;
	children: React.ReactNode;
}

export function SoftDeleteOrganizationButton({
	id,
	confirmation,
	children,
}: SoftDeleteOrganizationButtonProps) {
	const { dispatch } = useSoftDeleteOrganization();
	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("confirmation", confirmation);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
