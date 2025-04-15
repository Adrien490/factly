"use client";

import { SpinnerLoader } from "@/shared/components/spinner-loader";
import { useLinkStatus } from "next/link";

export function LoadingIndicator() {
	const { pending } = useLinkStatus();
	return (
		pending && (
			<SpinnerLoader className="loading-indicator" color="primary" size="sm" />
		)
	);
}
