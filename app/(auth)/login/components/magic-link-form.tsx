"use client";

import sendMagicLink from "@/app/(auth)/api/send-magic-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useActionState } from "react";

export default function MagicLinkForm() {
	const [state, action, isPending] = useActionState(sendMagicLink, null);

	return (
		<form action={action} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					name="email"
					id="email"
					defaultValue={state?.inputs?.email}
					type="email"
					placeholder="Enter your email address..."
					className={cn("", state?.errors?.email && "border-red-500")}
				/>
				{state?.errors?.email && (
					<p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
				)}
			</div>

			<Button type="submit" className="w-full mt-4" disabled={isPending}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					className="w-5 h-5 mr-2"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect width="20" height="16" x="2" y="4" rx="2" />
					<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
				</svg>
				Continue with email
			</Button>
		</form>
	);
}
