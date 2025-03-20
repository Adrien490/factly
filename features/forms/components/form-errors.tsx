import { cn } from "@/lib/utils";

interface FormErrorsProps {
	errors: unknown[];
	className?: string;
}

/**
 * Composant pour afficher les erreurs de formulaire
 * @param errors Tableau d'erreurs à afficher
 * @param className Classes CSS additionnelles
 */
export default function FormErrors({ errors, className }: FormErrorsProps) {
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<div
			className={cn("bg-destructive/15 p-3 rounded-md space-y-1", className)}
		>
			{errors.map((error, index) => (
				<p key={`form-error-${index}`} className="text-destructive text-sm">
					{String(error)}
				</p>
			))}
		</div>
	);
}
