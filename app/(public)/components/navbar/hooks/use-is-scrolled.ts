"use client";

import { useEffect, useState } from "react";

/**
 * Hook simple qui détecte si l'utilisateur a défilé au-delà d'un seuil spécifié
 * (debounce désactivé par défaut)
 * @param threshold - Seuil en pixels à partir duquel l'utilisateur est considéré comme ayant défilé
 * @param delay - Délai en millisecondes pour le debounce (par défaut: 0ms = désactivé)
 * @returns {boolean} - Indique si l'utilisateur a défilé au-delà du seuil
 */
export function useIsScrolled(threshold = 50, delay = 0): boolean {
	const isBrowser = typeof window !== "undefined";
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (!isBrowser) return;

		let timeoutId: NodeJS.Timeout | null = null;

		const handleScroll = () => {
			if (timeoutId) clearTimeout(timeoutId);

			if (delay <= 0) {
				// Exécution immédiate sans debounce
				setScrolled(window.scrollY > threshold);
			} else {
				timeoutId = setTimeout(() => {
					setScrolled(window.scrollY > threshold);
					timeoutId = null;
				}, delay);
			}
		};

		// Vérification initiale
		setScrolled(window.scrollY > threshold);

		// Utilisation de passive: true pour améliorer les performances
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [threshold, delay, isBrowser]);

	return scrolled;
}
