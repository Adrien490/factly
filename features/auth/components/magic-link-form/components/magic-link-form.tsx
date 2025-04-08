"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2, Mail, Sparkles } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

// Animations optimisées pour Core Web Vitals
const formVariants = {
	initial: { opacity: 0, y: 10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const buttonVariants = {
	idle: { scale: 1 },
	hover: {
		scale: 1.02,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 10,
		},
	},
	tap: { scale: 0.98 },
};

export function MagicLinkForm() {
	// Utilisation de useRef au lieu de useState pour suivre l'état
	const formRef = useRef<HTMLFormElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const isSubmittingRef = useRef(false);
	const isSuccessRef = useRef(false);

	const validateEmail = (value: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	};

	const handleEmailChange = () => {
		// Réinitialiser l'état de succès si l'utilisateur modifie son email
		if (isSuccessRef.current) {
			isSuccessRef.current = false;
			if (formRef.current) {
				formRef.current.classList.remove("success");
			}
			if (emailRef.current) {
				emailRef.current.classList.remove(
					"border-green-500/50",
					"focus-visible:ring-green-500/20",
					"text-green-600"
				);
			}
		}
	};

	const handleSubmit = async (formData: FormData) => {
		const emailValue = formData.get("email") as string;

		if (!emailValue || !validateEmail(emailValue)) {
			toast.error("Email invalide", {
				description:
					"Veuillez entrer une adresse email valide pour recevoir le lien magique",
				icon: <Mail className="text-destructive h-5 w-5" />,
				position: "top-center",
			});
			return;
		}

		// Modifier l'état de soumission via la référence
		isSubmittingRef.current = true;
		if (formRef.current) {
			formRef.current.classList.add("submitting");
		}

		// Simuler l'envoi d'email avec un toast de succès
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
			loading: "Envoi du lien de connexion...",
			success: () => {
				isSuccessRef.current = true;
				if (formRef.current) {
					formRef.current.classList.add("success");
					formRef.current.classList.remove("submitting");
				}
				return "Email envoyé avec succès";
			},
			error: "Une erreur est survenue, veuillez réessayer",
			position: "top-center",
		});

		// Réinitialiser l'état de soumission après un délai
		setTimeout(() => {
			isSubmittingRef.current = false;
			if (formRef.current && !isSuccessRef.current) {
				formRef.current.classList.remove("submitting");
			}
		}, 2000);
	};

	return (
		<motion.div initial="initial" animate="animate" variants={formVariants}>
			<form
				ref={formRef}
				action={handleSubmit}
				className="space-y-4 transition-all duration-300"
			>
				<div className="space-y-2">
					<Label
						htmlFor="email"
						className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 group"
					>
						<span className="relative flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
							<Mail className="w-3.5 h-3.5 text-primary transition-transform duration-300 group-hover:scale-110" />
							<span
								className="absolute inset-0 rounded-full bg-primary/5 blur-sm opacity-0 group-hover:opacity-80 transition-opacity duration-300"
								aria-hidden="true"
							></span>
						</span>
						<span className="form-label transition-all duration-300">
							Connexion par email
						</span>
						<span className="success-label absolute opacity-0 transform translate-y-1 transition-all duration-300 flex items-center gap-1.5 text-green-500">
							<Sparkles className="w-3.5 h-3.5" />
							Vérifiez votre boîte mail
						</span>
					</Label>

					<div className="relative">
						<Input
							ref={emailRef}
							name="email"
							id="email"
							type="email"
							placeholder="votre@email.fr"
							required
							autoComplete="email webauthn"
							autoFocus
							onChange={handleEmailChange}
							className="transition-all duration-300 pr-10 backdrop-blur-sm
                            focus-visible:ring-offset-2 focus-visible:ring-primary/20 focus-visible:border-primary/50
                            hover:border-primary/50 hover:shadow-[0_0_0_1px_rgba(var(--primary),0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)]"
						/>

						<div className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 transform scale-0 opacity-0 success-icon text-green-500">
							<motion.div
								initial={{ rotate: -10, scale: 0.5 }}
								animate={{ rotate: 0, scale: 1 }}
								transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
							>
								<CheckCircle className="w-5 h-5" />
							</motion.div>
						</div>

						{/* Points lumineux autour du champ quand focus */}
						<div
							className="absolute -inset-[2px] rounded-md bg-primary/10 opacity-0 blur-md transition-opacity duration-500 pointer-events-none focus-within:opacity-100"
							aria-hidden="true"
						></div>
					</div>

					<div className="h-6 overflow-hidden">
						<p className="success-message text-xs text-muted-foreground opacity-0 transform translate-y-4 transition-all duration-500 pl-1">
							Nous avons envoyé un lien de connexion à{" "}
							<strong className="text-primary/90">
								{emailRef.current?.value || ""}
							</strong>
						</p>
					</div>
				</div>

				<motion.div
					variants={buttonVariants}
					initial="idle"
					whileHover="hover"
					whileTap="tap"
					className="relative"
				>
					<Button
						type="submit"
						className="w-full group transform transition-all duration-300 overflow-hidden 
                        bg-gradient-to-r from-primary to-primary/90
                        hover:from-primary/95 hover:to-primary/85
                        active:scale-[0.98]"
						aria-live="polite"
						size="lg"
					>
						<span className="normal-state flex items-center transition-all duration-300">
							<span>Continuer avec email</span>
							<ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
						</span>

						<span className="submitting-state absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-300">
							<Loader2 className="w-4 h-4 animate-spin mr-2" />
							<span>Envoi en cours...</span>
						</span>

						<span className="success-state absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-300">
							<CheckCircle className="w-4 h-4 mr-2" />
							<span>Email envoyé</span>
						</span>

						{/* Effet shimmer au survol */}
						<div
							className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100"
							aria-hidden="true"
						>
							<div className="absolute h-full w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]" />
						</div>
					</Button>

					{/* Glow effect */}
					<div
						className="absolute inset-0 -z-10 transform scale-[0.97] opacity-70 rounded-lg bg-primary/40 blur-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
						aria-hidden="true"
					></div>
				</motion.div>

				<div className="overflow-hidden h-6">
					<p className="normal-note text-xs text-muted-foreground text-center pt-1 transition-all duration-300 transform translate-y-0">
						Nous vous enverrons un lien magique pour vous connecter sans mot de
						passe
					</p>
				</div>
			</form>
		</motion.div>
	);
}
