import { PageContainer } from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import OrganizationForm from "../../(with-sidebar)/organizations/components/organization-form";
import { NewOrganizationSidebar } from "./components/new-organization-sidebar";

export default async function NewOrganizationPage() {
	const breadcrumbs = [
		{ label: "Organisations", href: "/dashboard/organizations" },
		{ label: "Nouvelle organisation", href: "/dashboard/organizations/new" },
	];

	return (
		<SidebarProvider defaultOpen>
			<div className="flex min-h-[calc(100vh-4rem)] flex-1">
				<NewOrganizationSidebar />
				<SidebarInset className="pt-0">
					<div className="flex flex-col gap-4">
						<PageContainer>
							<PageHeader
								title="Créer une organisation"
								breadcrumbs={breadcrumbs}
								description="Créez une nouvelle organisation en remplissant le formulaire ci-dessous."
							/>
							<OrganizationForm />
						</PageContainer>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
