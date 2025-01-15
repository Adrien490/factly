"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MagicLinkForm() {
	return (
		<form className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					name="email"
					id="email"
					type="email"
					placeholder="Enter your email address..."
				/>
			</div>

			<Button type="submit" className="w-full mt-4">
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
