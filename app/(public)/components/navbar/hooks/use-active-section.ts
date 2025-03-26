"use client";

import { useEffect, useState } from "react";

type NavigationLink = {
	name: string;
	href: string;
};

/**
 * Hook personnalisé pour détecter la section active en fonction du défilement
 * @param navigationLinks - Tableau de liens de navigation avec href et name
 * @returns La section active courante
 */
export function useActiveSection(navigationLinks: NavigationLink[]) {
	const [activeSection, setActiveSection] = useState<string>("");

	useEffect(() => {
		// Ne s'exécute que côté client
		if (typeof window === "undefined") return;

		const sections = navigationLinks
			.map((link) => link.href.replace("#", ""))
			.filter(Boolean);

		const handleScroll = () => {
			// Trouver quelle section est actuellement visible
			const currentSection = sections.find((section) => {
				if (section === "home" && window.scrollY < 100) return true;

				const element = document.getElementById(section);
				if (!element) return false;

				const rect = element.getBoundingClientRect();
				// Section considérée visible si elle est dans la moitié supérieure de l'écran
				return (
					rect.top <= window.innerHeight / 2 &&
					rect.bottom >= window.innerHeight / 2
				);
			});

			if (currentSection) {
				setActiveSection(currentSection);
			}
		};

		// Vérification initiale
		handleScroll();

		// Utilisation de passive: true pour améliorer les performances
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => window.removeEventListener("scroll", handleScroll);
	}, [navigationLinks]);

	return activeSection;
}
