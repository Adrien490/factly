import { Logo, PageContainer } from "@/shared/components";
import { BackButton } from "@/shared/components/back-button";
import Link from "next/link";

export default function LegalPage() {
	return (
		<PageContainer className="relative py-8">
			{/* Navigation */}
			<div className="flex items-center gap-2 mb-8">
				<BackButton label="Retour" />
			</div>

			{/* En-tête */}
			<div className="flex items-center gap-4 mb-8">
				<Logo variant="default" size="sm" />
				<h1 className="text-2xl font-bold">Mentions légales</h1>
			</div>

			{/* Contenu */}
			<div className="prose prose-sm max-w-none dark:prose-invert">
				<p className="text-muted-foreground">
					Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
				</p>

				<h2>1. Présentation du projet</h2>
				<p>
					Factly est un projet développé dans le cadre d&apos;une formation en
					alternance/projet d&apos;école. Il s&apos;agit d&apos;une
					démonstration de compétences techniques et ne constitue pas une offre
					commerciale.
				</p>

				<h2>2. Responsable du projet</h2>
				<p>
					Ce projet est réalisé et maintenu par un étudiant dans le cadre de son
					cursus de formation.
				</p>

				<h2>3. Hébergement</h2>
				<p>Le site est hébergé à des fins éducatives.</p>

				<h2>4. Propriété intellectuelle</h2>
				<p>
					L&apos;ensemble des éléments composant le site Factly (textes,
					graphismes, logiciels, photographies, images, vidéos, sons, plans,
					logos, etc.) sont protégés par les lois relatives à la propriété
					intellectuelle.
				</p>
				<p>
					Cette démonstration est à but non commercial et éducatif uniquement.
				</p>

				<h2>5. Données personnelles</h2>
				<p>
					Ce site de démonstration ne collecte aucune donnée personnelle à des
					fins commerciales. Toute donnée saisie sur ce site est utilisée
					uniquement dans le cadre de la démonstration des fonctionnalités.
				</p>
				<p>
					Pour plus d&apos;informations, consultez notre{" "}
					<Link
						href="/privacy"
						className="text-primary/90 hover:text-primary transition-colors"
					>
						Politique de Confidentialité
					</Link>
					.
				</p>

				<h2>6. Cookies</h2>
				<p>
					Le site utilise des cookies à des fins techniques et de démonstration
					uniquement. Ces cookies sont nécessaires au fonctionnement de
					l&apos;application et ne servent pas à des fins publicitaires ou
					commerciales.
				</p>

				<h2>7. Crédits</h2>
				<p>
					Conception et développement : Projet étudiant
					<br />
					Icônes : Lucide Icons
					<br />
					Polices : Inter, Source Serif
				</p>

				<h2>8. Avertissement</h2>
				<p>
					Factly est un projet de démonstration. Les fonctionnalités présentées
					sont à titre illustratif et ne constituent pas une offre commerciale.
					Les données affichées sont fictives.
				</p>

				<h2>9. Contact</h2>
				<p>
					Pour toute question concernant ce projet, vous pouvez envoyer un email
					à : adrien.poirier49@gmail.com
				</p>
			</div>
		</PageContainer>
	);
}
