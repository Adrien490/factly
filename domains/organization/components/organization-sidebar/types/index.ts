import { GetOrganizationsReturn } from "@/domains/organization/features";
import { Sidebar } from "@/shared/components/ui/sidebar";
import React from "react";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	organizationId: string;
	organizationsPromise: Promise<GetOrganizationsReturn>;
}
