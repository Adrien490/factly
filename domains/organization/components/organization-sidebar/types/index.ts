import { GetOrganizationsReturn } from "@/domains/organization/features";
import { Sidebar } from "@/shared/components/shadcn-ui/sidebar";
import React from "react";

export interface OrganizationSidebarProps
	extends React.ComponentProps<typeof Sidebar> {
	organizationsPromise: Promise<GetOrganizationsReturn>;
}
