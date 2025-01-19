import Navbar from "@/components/navbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col flex-1">
			<Navbar />
			<div className="mt-8">{children}</div>
		</div>
	);
}
