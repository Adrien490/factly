import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ResetPasswordEmailTemplateProps {
	url: string;
	userEmail: string;
}

export function ResetPasswordEmailTemplate({
	url,
	userEmail,
}: ResetPasswordEmailTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Réinitialisez votre mot de passe Factly</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto py-8 px-4">
						<Heading className="text-2xl font-bold text-gray-900 mb-4">
							Réinitialisation de votre mot de passe
						</Heading>
						<Text className="text-gray-600 mb-4">Bonjour,</Text>
						<Text className="text-gray-600 mb-4">
							Vous avez demandé la réinitialisation de votre mot de passe pour
							votre compte Factly ({userEmail}). Cliquez sur le bouton
							ci-dessous pour créer un nouveau mot de passe.
						</Text>
						<Section className="text-center my-8">
							<Button
								className="bg-primary text-white px-6 py-3 rounded-md font-medium"
								href={url}
							>
								Réinitialiser mon mot de passe
							</Button>
						</Section>
						<Text className="text-gray-600 mb-4">
							Si vous n&apos;avez pas demandé cette réinitialisation, vous
							pouvez ignorer cet email.
						</Text>
						<Text className="text-gray-600 mb-4">
							Ce lien expirera dans 24 heures.
						</Text>
						<Text className="text-gray-600">
							Cordialement,
							<br />
							L&apos;équipe Factly
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
