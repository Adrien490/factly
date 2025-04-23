"use client";
import { useTransition } from "react";
import { useDeleteFiscalYear } from "../hooks/use-delete-fiscal-year";

interface DeleteFiscalYearButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function DeleteFiscalYearButton({
	organizationId,
	id,
	children,
}: DeleteFiscalYearButtonProps) {
	const { dispatch } = useDeleteFiscalYear();

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
