import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	return (
		<SidebarProvider defaultOpen>
			<div className="flex min-h-[calc(100vh-4rem)] flex-1">
				<DashboardSidebar />
				<SidebarInset>{children}</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
