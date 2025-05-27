"use client";

import { useTransition } from "react";
import { useArchiveMultipleProducts } from "../hooks/use-archive-multiple-products";

interface ArchiveMultipleProductsButtonProps {
	ids: string[];
	children: React.ReactNode;
}

export function ArchiveMultipleProductsButton({
	ids,
	children,
}: ArchiveMultipleProductsButtonProps) {
	const { dispatch } = useArchiveMultipleProducts();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
