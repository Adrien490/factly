"use client";

import { ChevronRight, LayoutDashboard, Users } from "lucide-react";

import { LoadingIndicator } from "@/shared/components/loading-indicator";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/shadcn-ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/shared/components/shadcn-ui/sidebar";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const navItems = (organizationId: string) => [
	{
		title: "Tableau de bord",
		url: `/dashboard/${organizationId}`,
		icon: LayoutDashboard,
	},
	{
		title: "Clients",
		icon: Users,
		url: `/dashboard/${organizationId}/clients`,
		items: [
			{
				title: "Liste des clients",
				url: `/dashboard/${organizationId}/clients`,
			},
			{
				title: "Ajouter un client",
				url: `/dashboard/${organizationId}/clients/new`,
			},
		],
	},
	/*
		{
			title: "Catalogue",
			icon: Package,
			items: [
				{
					title: "Produits",
					url: `/dashboard/${organizationId}/products`,
				},
				{
					title: "Ajouter un produit",
					url: `/dashboard/${organizationId}/products/new`,
				},
				{
					title: "Catégories",
					url: `/dashboard/${organizationId}/products/categories`,
				},
				{
					title: "Taux de TVA",
					url: `/dashboard/${organizationId}/products/tax-rates`,
				},
			],
		},
		{
			title: "Devis",
			icon: FileText,
			items: [
				{
					title: "Liste des devis",
					url: `/dashboard/${organizationId}/quotes`,
				},
				{
					title: "Créer un devis",
					url: `/dashboard/${organizationId}/quotes/new`,
				},
			],
		},
		{
			title: "Facturation",
			icon: Receipt,
			items: [
				{
					title: "Liste des factures",
					url: `/dashboard/${organizationId}/invoices`,
				},
				{
					title: "Créer une facture",
					url: `/dashboard/${organizationId}/invoices/new`,
				},

				{
					title: "Paiements",
					url: `/dashboard/${organizationId}/invoices/payments`,
				},
			],
		},
		{
			title: "Comptabilité",
			icon: Calculator,
			items: [
				{
					title: "Années fiscales",
					url: `/dashboard/${organizationId}/accounting/fiscal-years`,
				},
				{
					title: "Gestion TVA",
					url: `/dashboard/${organizationId}/accounting/vat`,
				},
				{
					title: "Export comptable",
					url: `/dashboard/${organizationId}/accounting/export`,
				},
			],
		},

		{
			title: "Organisation",
			icon: Building2,
			items: [
				{
					title: "Informations légales",
					url: `/dashboard/${organizationId}/organization/legal`,
				},
				{
					title: "Membres",
					url: `/dashboard/${organizationId}/organization/members`,
				},
				{
					title: "Invitations",
					url: `/dashboard/${organizationId}/organization/invitations`,
				},
			],
		},
		{
			title: "Paramètres",
			icon: Settings,
			items: [
				{
					title: "Informations générales",
					url: `/dashboard/${organizationId}/settings/general`,
				},
				{
					title: "Facturation électronique",
					url: `/dashboard/${organizationId}/settings/e-invoicing`,
				},
				{
					title: "Numérotation",
					url: `/dashboard/${organizationId}/settings/numbering`,
				},
				{
					title: "Mentions légales",
					url: `/dashboard/${organizationId}/settings/legal-notices`,
				},
			],
		},
		*/
];

export function NavMain() {
	const pathname = usePathname();
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";
	const params = useParams();
	const organizationId = params.organizationId as string;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu principal</SidebarGroupLabel>
			<SidebarMenu>
				{navItems(organizationId).map((item) => {
					const hasSubItems = item.items && item.items.length > 0;
					// Le menu principal est actif si le pathname correspond exactement à son URL
					const isMainItemActive = pathname === item.url;
					// Ou si l'un de ses sous-éléments est actif
					const hasActiveSubItem = item.items?.some(
						(subItem) => pathname === subItem.url
					);
					// État actif global pour le menu principal
					const isActive = isMainItemActive || hasActiveSubItem;

					// Rendu différent selon la présence ou non de sous-menus
					if (!hasSubItems) {
						// Menu simple sans sous-menus
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton tooltip={item.title} asChild>
									<Link
										href={item.url}
										className={cn(
											"flex items-center justify-between",
											isActive && "bg-sidebar-accent"
										)}
									>
										<div className="flex items-center gap-2">
											{item.icon && <item.icon className="size-4" />}
											{!isCollapsed && !hasSubItems && (
												<span>{item.title}</span>
											)}
										</div>
										<LoadingIndicator />
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					// Menu avec sous-menus
					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={isActive || hasActiveSubItem}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title} asChild>
										<Link
											href={isCollapsed ? item.url : ""}
											className={cn(
												(isActive && !hasSubItems) || (isActive && isCollapsed)
													? "bg-sidebar-accent"
													: ""
											)}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</Link>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => {
											// Vérifier si ce sous-élément spécifique est actif
											const isSubItemActive = pathname === subItem.url;

											return (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<Link
															href={subItem.url}
															className={cn(
																"flex items-center justify-between",
																isSubItemActive &&
																	!isCollapsed &&
																	"bg-sidebar-accent"
															)}
														>
															<span>{subItem.title}</span>
															<LoadingIndicator />
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
