"use client";

import { useTransition } from "react";
import { useDeleteFiscalYear } from "../hooks/use-delete-fiscal-year";

interface DeleteFiscalYearButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteFiscalYearButton({
	id,
	children,
}: DeleteFiscalYearButtonProps) {
	const { dispatch } = useDeleteFiscalYear();

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
