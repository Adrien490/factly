import { GetOrganizationsReturn } from "@/domains/organization/features/get-organizations";
import { Sidebar } from "@/shared/components/ui/sidebar";
import React from "react";

export interface OrganizationSidebarProps
	extends React.ComponentProps<typeof Sidebar> {
	organizationsPromise: Promise<GetOrganizationsReturn>;
}
