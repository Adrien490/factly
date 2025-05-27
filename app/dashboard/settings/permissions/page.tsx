import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import db from "@/shared/lib/db";
import { Eye, Settings, Shield, Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PermissionsPage() {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect("/auth/signin");
	}

	// Vérification de l'appartenance
	const membership = await checkMembership({
		userId: session.user.id,
	});

	if (!membership.isMember) {
		redirect("/dashboard/forbidden");
	}

	// Récupération des données
	const [roles, permissions, members] = await Promise.all([
		// Récupérer tous les rôles avec leurs permissions
		db.role.findMany({
			include: {
				rolePermissions: {
					include: {
						permission: true,
					},
				},
				memberRoles: {
					include: {
						member: {
							include: {
								user: true,
							},
						},
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		}),
		// Récupérer toutes les permissions
		db.permission.findMany({
			orderBy: {
				type: "asc",
			},
		}),
		// Récupérer tous les membres avec leurs rôles
		db.member.findMany({
			include: {
				user: true,
				memberRoles: {
					include: {
						role: true,
					},
				},
			},
		}),
	]);

	const getRoleIcon = (roleName: string) => {
		switch (roleName) {
			case "admin":
				return <Shield className="h-4 w-4" />;
			case "manager":
				return <Settings className="h-4 w-4" />;
			case "user":
				return <Users className="h-4 w-4" />;
			case "viewer":
				return <Eye className="h-4 w-4" />;
			default:
				return <Shield className="h-4 w-4" />;
		}
	};

	const getRoleColor = (roleName: string) => {
		switch (roleName) {
			case "admin":
				return "destructive";
			case "manager":
				return "default";
			case "user":
				return "secondary";
			case "viewer":
				return "outline";
			default:
				return "outline";
		}
	};

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Gestion des droits</h1>
					<p className="text-muted-foreground">
						Gérez les rôles et permissions des membres de votre entreprise
					</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Section Rôles */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Rôles système
						</CardTitle>
						<CardDescription>
							{roles.length} rôles configurés dans le système
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{roles.map((role) => (
							<div
								key={role.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div className="flex items-center gap-3">
									{getRoleIcon(role.name)}
									<div>
										<div className="font-medium">{role.displayName}</div>
										<div className="text-sm text-muted-foreground">
											{role.description}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											getRoleColor(role.name) as
												| "destructive"
												| "default"
												| "secondary"
												| "outline"
										}
									>
										{role.rolePermissions.length} permissions
									</Badge>
									<Badge variant="outline">
										{role.memberRoles.length} membres
									</Badge>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Section Permissions */}
				<Card>
					<CardHeader>
						<CardTitle>Permissions disponibles</CardTitle>
						<CardDescription>
							{permissions.length} permissions configurées
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{permissions.map((permission) => (
								<div
									key={permission.id}
									className="flex items-center justify-between p-2 border rounded"
								>
									<div>
										<div className="font-medium text-sm">{permission.name}</div>
										<div className="text-xs text-muted-foreground">
											{permission.description}
										</div>
									</div>
									<Badge variant="outline" className="text-xs">
										{permission.type}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Section Membres */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Membres et leurs rôles
					</CardTitle>
					<CardDescription>
						{members.length} membres dans l&apos;entreprise
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{members.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div className="flex items-center gap-3">
									<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
										<Users className="h-4 w-4" />
									</div>
									<div>
										<div className="font-medium">{member.user.name}</div>
										<div className="text-sm text-muted-foreground">
											{member.user.email}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{member.memberRoles.length > 0 ? (
										member.memberRoles.map((memberRole) => (
											<Badge
												key={memberRole.id}
												variant={
													getRoleColor(memberRole.role.name) as
														| "destructive"
														| "default"
														| "secondary"
														| "outline"
												}
											>
												{memberRole.role.displayName}
											</Badge>
										))
									) : (
										<Badge variant="outline">Aucun rôle</Badge>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex gap-4">
				<Button variant="outline" disabled>
					Assigner des rôles
				</Button>
				<Button variant="outline" disabled>
					Créer un rôle personnalisé
				</Button>
				<Button variant="outline" disabled>
					Exporter les permissions
				</Button>
			</div>

			<div className="text-sm text-muted-foreground">
				💡 <strong>Note :</strong> Les fonctionnalités d&apos;édition des rôles
				et permissions seront disponibles dans une prochaine version.
			</div>
		</div>
	);
}
