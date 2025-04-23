"use client";
import { useTransition } from "react";
import { useSetFiscalYearAsDefault } from "../hooks/use-set-fiscal-year-as-default";

interface SetFiscalYearAsDefaultButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function SetFiscalYearAsDefaultButton({
	organizationId,
	id,
	children,
}: SetFiscalYearAsDefaultButtonProps) {
	const { dispatch } = useSetFiscalYearAsDefault();

	const [, startTransition] = useTransition();

	const handleSetAsDefault = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleSetAsDefault}>{children}</span>;
}
