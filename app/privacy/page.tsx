import { Logo, PageContainer } from "@/shared/components";
import { BackButton } from "@/shared/components/back-button";

export default function PrivacyPage() {
	return (
		<PageContainer className="relative py-8">
			{/* Navigation */}
			<div className="flex items-center gap-2 mb-8">
				<BackButton label="Retour" />
			</div>

			{/* En-tête */}
			<div className="flex items-center gap-4 mb-8">
				<Logo variant="default" size="sm" />
				<h1 className="text-2xl font-bold">Politique de confidentialité</h1>
			</div>

			{/* Contenu */}
			<div className="prose prose-sm max-w-none dark:prose-invert">
				<p className="text-muted-foreground">
					Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
				</p>

				<h2>1. Introduction</h2>
				<p>
					Chez Factly, nous respectons votre vie privée et nous nous engageons à
					protéger vos données personnelles. Cette politique de confidentialité
					vous informe sur la façon dont nous traitons vos données lorsque vous
					visitez notre site web et vous informe de vos droits en matière de
					protection des données.
				</p>

				<h2>2. Les données que nous collectons</h2>
				<p>
					Nous pouvons collecter, utiliser, stocker et transférer différents
					types de données personnelles vous concernant, notamment :
				</p>
				<ul>
					<li>Données d&apos;identité (nom, prénom, adresse email)</li>
					<li>Données de contact (adresse email, numéro de téléphone)</li>
					<li>
						Données techniques (adresse IP, type et version de navigateur)
					</li>
					<li>
						Données d&apos;utilisation (informations sur votre navigation sur
						notre site)
					</li>
					<li>
						Données de profil (vos préférences, feedback et réponses aux
						enquêtes)
					</li>
				</ul>

				<h2>3. Comment nous utilisons vos données</h2>
				<p>
					Nous utiliserons vos données personnelles uniquement lorsque la loi
					nous y autorise. Le plus souvent, nous utiliserons vos données
					personnelles dans les circonstances suivantes :
				</p>
				<ul>
					<li>Pour exécuter le contrat que nous avons conclu avec vous</li>
					<li>
						Lorsque cela est nécessaire pour nos intérêts légitimes et que vos
						intérêts ne prévalent pas sur ces intérêts
					</li>
					<li>
						Lorsque nous devons nous conformer à une obligation légale ou
						réglementaire
					</li>
				</ul>

				<h2>4. Protection des données</h2>
				<p>
					Nous avons mis en place des mesures de sécurité appropriées pour
					empêcher que vos données personnelles soient accidentellement perdues,
					utilisées ou consultées de manière non autorisée. De plus, nous
					limitons l&apos;accès à vos données personnelles aux employés, agents,
					contractants et autres tiers qui ont un besoin professionnel de les
					connaître.
				</p>

				<h2>5. Conservation des données</h2>
				<p>
					Nous ne conserverons vos données personnelles que pendant la durée
					nécessaire à la réalisation des finalités pour lesquelles nous les
					avons collectées, y compris pour satisfaire aux exigences légales,
					comptables ou de déclaration.
				</p>

				<h2>6. Vos droits légaux</h2>
				<p>
					Dans certaines circonstances, vous disposez de droits en vertu des
					lois sur la protection des données concernant vos données
					personnelles, notamment le droit d&apos;accès, de rectification,
					d&apos;effacement, d&apos;opposition au traitement, de limitation du
					traitement, de portabilité des données et de retrait du consentement.
				</p>

				<h2>7. Contact</h2>
				<p>
					Si vous avez des questions concernant cette politique de
					confidentialité ou nos pratiques en matière de confidentialité,
					veuillez nous contacter à l&apos;adresse email suivante :
					privacy@factly.com
				</p>
			</div>
		</PageContainer>
	);
}
