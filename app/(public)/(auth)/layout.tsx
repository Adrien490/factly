import { Logo, Spotlight } from "@/shared/components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
			{/* Spotlight avec effet subtil */}
			<Spotlight translateY={-100} width={500} height={500} duration={10} />

			{/* Navigation simplifiée */}
			<header className="fixed top-0 left-0 w-full p-4 sm:p-8 z-20 flex justify-between items-center">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full bg-background/60 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur-xs transition-colors hover:text-foreground"
					aria-label="Retour à l'accueil"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Accueil</span>
				</Link>
				<Logo variant="default" size="md" shape="circle" hideText={true} />
			</header>

			{children}
		</div>
	);
}
