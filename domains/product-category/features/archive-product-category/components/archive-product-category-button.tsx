"use client";

import { useTransition } from "react";
import { useArchiveProductCategory } from "../hooks/use-archive-product-category";

interface ArchiveProductCategoryButtonProps {
	id: string;
	children: React.ReactNode;
}

export function ArchiveProductCategoryButton({
	id,
	children,
}: ArchiveProductCategoryButtonProps) {
	const { dispatch } = useArchiveProductCategory();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		formData.append("id", id);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
