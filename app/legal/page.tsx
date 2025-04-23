import { Button, Logo, PageContainer } from "@/shared/components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
	return (
		<PageContainer className="relative py-8">
			{/* Navigation */}
			<div className="flex items-center gap-2 mb-8">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Retour à l&apos;accueil
					</Link>
				</Button>
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

				<h2>1. Éditeur du site</h2>
				<p>
					Factly SAS
					<br />
					Société par actions simplifiée au capital de 10 000 €
					<br />
					Siège social : 123 Avenue de la République, 75011 Paris, France
					<br />
					SIREN : 123 456 789
					<br />
					RCS Paris B 123 456 789
					<br />
					N° TVA Intracommunautaire : FR 12 123456789
					<br />
					Tél : +33 (0)1 23 45 67 89
					<br />
					Email : contact@factly.com
				</p>

				<h2>2. Directeur de la publication</h2>
				<p>
					Le directeur de la publication est Monsieur Jean Dupont, en sa qualité
					de Président de Factly SAS.
				</p>

				<h2>3. Hébergement</h2>
				<p>
					Le site Factly est hébergé par :
					<br />
					OVH SAS
					<br />
					2 rue Kellermann, 59100 Roubaix, France
					<br />
					Tél : +33 (0)8 99 70 17 61
				</p>

				<h2>4. Propriété intellectuelle</h2>
				<p>
					L&apos;ensemble des éléments composant le site Factly (textes,
					graphismes, logiciels, photographies, images, vidéos, sons, plans,
					logos, marques, etc.) sont la propriété exclusive de Factly SAS. Ces
					éléments sont protégés par les lois françaises et internationales
					relatives à la propriété intellectuelle.
				</p>
				<p>
					Toute reproduction, représentation, modification, publication,
					adaptation de tout ou partie des éléments du site, quel que soit le
					moyen ou le procédé utilisé, est interdite, sauf autorisation écrite
					préalable de Factly SAS.
				</p>

				<h2>5. Données personnelles</h2>
				<p>
					Les informations concernant la collecte et le traitement des données
					personnelles sont détaillées dans notre{" "}
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
					Le site Factly utilise des cookies pour améliorer l&apos;expérience
					utilisateur. Pour plus d&apos;informations sur l&apos;utilisation des
					cookies, veuillez consulter notre Politique de Confidentialité.
				</p>

				<h2>7. Crédits</h2>
				<p>
					Conception et développement : Factly SAS
					<br />
					Illustrations : Freepik
					<br />
					Icônes : Lucide Icons
					<br />
					Polices : Inter, Source Serif
				</p>

				<h2>8. Loi applicable et juridiction</h2>
				<p>
					Les présentes mentions légales sont régies par la loi française. En
					cas de litige, les tribunaux français seront seuls compétents.
				</p>

				<h2>9. Contact</h2>
				<p>
					Pour toute question relative à ces mentions légales, vous pouvez nous
					contacter à l&apos;adresse suivante : legal@factly.com
				</p>
			</div>
		</PageContainer>
	);
}
