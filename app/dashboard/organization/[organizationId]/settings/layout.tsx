import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import OrganizationSettingsSidebar from "./components/organization-settings-sidebar";

interface SettingsLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		organizationId: string;
	}>;
}

export default async function SettingsLayout({
	children,
	params,
}: SettingsLayoutProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	return (
		<SidebarProvider defaultOpen>
			<div className="flex min-h-[calc(100vh-4rem)] flex-1">
				<OrganizationSettingsSidebar organizationId={organizationId} />
				<SidebarInset>{children}</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
