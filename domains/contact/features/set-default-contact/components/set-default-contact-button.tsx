"use client";

import { useTransition } from "react";
import { useSetDefaultContact } from "../hooks/use-set-default-contact";

interface SetDefaultContactButtonProps {
	organizationId: string;
	id: string;
	clientId?: string;
	supplierId?: string;
	children: React.ReactNode;
}

export function SetDefaultContactButton({
	organizationId,
	id,
	clientId,
	supplierId,
	children,
}: SetDefaultContactButtonProps) {
	const { dispatch } = useSetDefaultContact();

	const [, startTransition] = useTransition();

	const handleSetDefault = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		if (clientId) formData.append("clientId", clientId);
		if (supplierId) formData.append("supplierId", supplierId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleSetDefault}>{children}</span>;
}
