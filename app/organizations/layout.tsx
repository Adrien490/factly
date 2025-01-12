import Navbar from "./components/navbar";

export default function OrganizationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<div className="px-4 lg:px-6 py-6">{children}</div>
			</main>
		</div>
	);
}
