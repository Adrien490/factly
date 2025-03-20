"use client";

import { useEffect, useState } from "react";

/**
 * Hook simple qui détecte si l'utilisateur a défilé au-delà d'un seuil spécifié
 * @param threshold - Seuil en pixels à partir duquel l'utilisateur est considéré comme ayant défilé
 * @returns {boolean} - Indique si l'utilisateur a défilé au-delà du seuil
 */
export function useIsScrolled(threshold = 50): boolean {
	const isBrowser = typeof window !== "undefined";
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (!isBrowser) return;
		const handleScroll = () => {
			setScrolled(window.scrollY > threshold);
		};
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [threshold, isBrowser]);

	return scrolled;
}
