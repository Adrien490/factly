import { Logo, Spotlight } from "@/shared/components";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
			{/* Spotlight avec effet subtil */}
			<Spotlight translateY={-100} width={500} height={500} duration={10} />

			{/* Navigation simplifiée */}
			<header className="fixed top-0 left-0 w-full p-4 sm:p-8 z-20 flex justify-between items-center">
				<Logo variant="default" size="md" shape="circle" hideText={true} />
			</header>

			{children}
		</div>
	);
}
