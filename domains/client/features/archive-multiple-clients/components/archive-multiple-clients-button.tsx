"use client";

import { useTransition } from "react";
import { useArchiveMultipleClients } from "../hooks/use-archive-multiple-clients";

interface ArchiveMultipleClientsButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function ArchiveMultipleClientsButton({
	organizationId,
	ids,
	children,
}: ArchiveMultipleClientsButtonProps) {
	const { dispatch } = useArchiveMultipleClients();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
