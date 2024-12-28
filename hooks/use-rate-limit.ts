"use client";

import { useCallback, useRef, useState } from "react";

interface UseRateLimitOptions {
	limit: number; // Time in milliseconds
	onLimit?: () => void;
}

export function useRateLimit({ limit, onLimit }: UseRateLimitOptions) {
	const [isLimited, setIsLimited] = useState(false);
	const lastCallTime = useRef<number>(0);

	const shouldLimit = useCallback(() => {
		const now = Date.now();
		const timeSinceLastCall = now - lastCallTime.current;

		if (timeSinceLastCall < limit) {
			onLimit?.();
			setIsLimited(true);
			return true;
		}

		lastCallTime.current = now;
		setIsLimited(false);
		return false;
	}, [limit, onLimit]);

	return { isLimited, shouldLimit };
}
