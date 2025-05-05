"use client";

import { useTransition } from "react";
import { useArchiveProductCategory } from "../hooks/use-archive-product-category";

interface ArchiveProductCategoryButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function ArchiveProductCategoryButton({
	organizationId,
	id,
	children,
}: ArchiveProductCategoryButtonProps) {
	const { dispatch } = useArchiveProductCategory();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
