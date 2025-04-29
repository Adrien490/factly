"use client";

import { useTransition } from "react";
import { useArchiveMultipleClients } from "../hooks/use-archive-multiple-clients";

interface ArchiveMultipleClientsButtonProps {
	ids: string[];
	organizationId: string;
	children: React.ReactNode;
}

export function ArchiveMultipleClientsButton({
	ids,
	organizationId,
	children,
}: ArchiveMultipleClientsButtonProps) {
	const { dispatch } = useArchiveMultipleClients();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => formData.append("ids", id));
		formData.append("organizationId", organizationId);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
