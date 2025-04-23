import { Button, Logo, PageContainer } from "@/shared/components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
				<h1 className="text-2xl font-bold">Conditions d&apos;utilisation</h1>
			</div>

			{/* Contenu */}
			<div className="prose prose-sm max-w-none dark:prose-invert">
				<p className="text-muted-foreground">
					Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
				</p>

				<h2>1. Acceptation des conditions</h2>
				<p>
					En accédant à ce site web, vous acceptez d&apos;être lié par ces
					conditions d&apos;utilisation, toutes les lois et règlements
					applicables, et vous acceptez que vous êtes responsable du respect des
					lois locales applicables. Si vous n&apos;acceptez pas l&apos;une de
					ces conditions, il vous est interdit d&apos;utiliser ou d&apos;accéder
					à ce site.
				</p>

				<h2>2. Licence d&apos;utilisation</h2>
				<p>
					L&apos;autorisation est accordée de télécharger temporairement une
					copie des documents (informations ou logiciels) sur le site web de
					Factly pour un visionnement transitoire personnel et non commercial
					uniquement. Il s&apos;agit de l&apos;octroi d&apos;une licence, et non
					d&apos;un transfert de titre, et sous cette licence, vous ne pouvez
					pas :
				</p>
				<ul>
					<li>modifier ou copier les documents;</li>
					<li>
						utiliser les documents à des fins commerciales ou pour toute
						exposition publique;
					</li>
					<li>
						tenter de décompiler ou de faire de l&apos;ingénierie inverse de
						tout logiciel contenu sur le site web de Factly;
					</li>
					<li>
						supprimer tout droit d&apos;auteur ou autres notations de propriété
						des documents; ou
					</li>
					<li>
						transférer les documents à une autre personne ou &quot;miroir&quot;
						les documents sur tout autre serveur.
					</li>
				</ul>

				<h2>3. Clause de non-responsabilité</h2>
				<p>
					Les documents sur le site web de Factly sont fournis &quot;tels
					quels&quot;. Factly ne donne aucune garantie, expresse ou implicite,
					et décline et nie par la présente toutes les autres garanties, y
					compris, sans limitation, les garanties implicites ou les conditions
					de qualité marchande, d&apos;adéquation à un usage particulier, ou de
					non-violation de la propriété intellectuelle ou autre violation des
					droits.
				</p>

				<h2>4. Limitations</h2>
				<p>
					En aucun cas, Factly ou ses fournisseurs ne seront responsables de
					tout dommage (y compris, sans limitation, les dommages pour perte de
					données ou de profit, ou en raison d&apos;une interruption
					d&apos;activité) découlant de l&apos;utilisation ou de
					l&apos;incapacité d&apos;utiliser les matériaux sur le site web de
					Factly, même si Factly ou un représentant autorisé de Factly a été
					notifié oralement ou par écrit de la possibilité de tels dommages.
				</p>

				<h2>5. Modifications des conditions d&apos;utilisation</h2>
				<p>
					Factly peut réviser ces conditions d&apos;utilisation de son site web
					à tout moment sans préavis. En utilisant ce site web, vous acceptez
					d&apos;être lié par la version actuelle de ces conditions
					d&apos;utilisation.
				</p>

				<h2>6. Loi applicable</h2>
				<p>
					Ces conditions sont régies et interprétées conformément aux lois de la
					France, et vous vous soumettez irrévocablement à la juridiction
					exclusive des tribunaux de cette juridiction.
				</p>
			</div>
		</PageContainer>
	);
}
