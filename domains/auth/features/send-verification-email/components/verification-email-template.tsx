import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface VerificationEmailTemplateProps {
	url: string;
	userEmail: string;
}

export function VerificationEmailTemplate({
	url,
}: VerificationEmailTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Vérifiez votre adresse email pour Factly</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>Vérification de votre email</Heading>
					<Text style={text}>Bonjour,</Text>
					<Text style={text}>
						Merci de vous être inscrit sur Factly. Pour activer votre compte,
						veuillez cliquer sur le bouton ci-dessous pour vérifier votre
						adresse email.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href={url}>
							Vérifier mon email
						</Button>
					</Section>
					<Text style={text}>
						Si vous n&apos;avez pas créé de compte, vous pouvez ignorer cet
						email.
					</Text>
					<Text style={footer}>
						<Link href="https://factly.fr" style={link}>
							Factly
						</Link>
						{" • "}
						<Link href="https://factly.fr/privacy" style={link}>
							Politique de confidentialité
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const h1 = {
	color: "#333",
	fontSize: "24px",
	fontWeight: "600",
	lineHeight: "1.3",
	margin: "16px 0",
};

const text = {
	color: "#333",
	fontSize: "16px",
	lineHeight: "1.5",
	margin: "16px 0",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const button = {
	backgroundColor: "#000",
	borderRadius: "6px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "600",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
};

const footer = {
	color: "#898989",
	fontSize: "14px",
	lineHeight: "1.5",
	margin: "32px 0 0",
	textAlign: "center" as const,
};

const link = {
	color: "#898989",
	textDecoration: "underline",
};
