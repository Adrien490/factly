"use client";

import { useTransition } from "react";
import { useArchiveProduct } from "../hooks/use-archive-product";

interface ArchiveProductButtonProps {
	id: string;
	children: React.ReactNode;
}

export function ArchiveProductButton({
	id,
	children,
}: ArchiveProductButtonProps) {
	const { dispatch } = useArchiveProduct();
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
