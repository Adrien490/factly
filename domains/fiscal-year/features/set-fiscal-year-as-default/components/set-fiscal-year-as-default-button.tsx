"use client";

import { useTransition } from "react";
import { useSetFiscalYearAsDefault } from "../hooks/use-set-fiscal-year-as-default";

interface SetFiscalYearAsDefaultButtonProps {
	id: string;
	children: React.ReactNode;
}

export function SetFiscalYearAsDefaultButton({
	id,
	children,
}: SetFiscalYearAsDefaultButtonProps) {
	const { dispatch } = useSetFiscalYearAsDefault();

	const [, startTransition] = useTransition();

	const handleSetAsDefault = () => {
		const formData = new FormData();
		formData.append("id", id);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleSetAsDefault}>{children}</span>;
}
