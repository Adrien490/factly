"use client";

import { useTransition } from "react";
import { useArchiveClient } from "../hooks/use-archive-client";

interface ArchiveClientButtonProps {
	id: string;
	children: React.ReactNode;
}

export function ArchiveClientButton({
	id,
	children,
}: ArchiveClientButtonProps) {
	const { dispatch } = useArchiveClient();
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
