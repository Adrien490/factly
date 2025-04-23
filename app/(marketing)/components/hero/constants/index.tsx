import { Clock, Database, Shield } from "lucide-react";

export const advantages = [
	{
		text: "Facturation automatisée",
		icon: <Clock className="h-4 w-4 text-primary" />,
	},
	{
		text: "Gestion de stock",
		icon: <Database className="h-4 w-4 text-primary" />,
	},
	{
		text: "Sécurité RGPD",
		icon: <Shield className="h-4 w-4 text-primary" />,
	},
] as const;
