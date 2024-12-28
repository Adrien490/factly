"use client";

import createClient from "@/api/client/create-client";
import ServerActionResult from "@/components/server-action-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ServerActionStatus } from "@/lib/types/server-action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ClientReferenceField } from "./client-reference-field";

export default function ClientForm() {
	const [state, action, isPending] = useActionState(createClient, null);

	const { toast } = useToast();

	useEffect(() => {
		if (!state || state.status !== ServerActionStatus.SUCCESS) return;
		toast({
			title: "Success",
			description: state.message,
		});
	}, [state, toast]);

	return (
		<form action={action}>
			<ServerActionResult response={state} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="border-l-4 border-l-primary/50 shadow-lg">
					<CardHeader className="space-y-1">
						<h3 className="text-lg font-semibold tracking-tight">
							Basic Information
						</h3>
						<p className="text-sm text-muted-foreground">
							Enter the client&apos;s primary contact details
						</p>
					</CardHeader>
					<CardContent className="grid gap-4">
						<ClientReferenceField
							defaultValue={state?.inputs?.reference}
							error={state?.errors?.reference}
						/>
						<div className="space-y-2">
							<Label htmlFor="name" className="font-medium">
								Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="name"
								name="name"
								defaultValue={state?.inputs?.name}
								placeholder="Enter client name"
								className={cn(
									"",
									state?.errors?.name && "border-red-500 ring-red-100"
								)}
							/>
							{state?.errors?.name && (
								<p className="text-red-500 text-sm">{state.errors.name[0]}</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="email" className="font-medium">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									defaultValue={state?.inputs?.email}
									placeholder="client@example.com"
									className={cn(
										"",
										state?.errors?.email && "border-red-500 ring-red-100"
									)}
								/>
								{state?.errors?.email && (
									<p className="text-red-500 text-sm">
										{state.errors.email[0]}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone" className="font-medium">
									Phone
								</Label>
								<Input
									id="phone"
									name="phone"
									defaultValue={state?.inputs?.phone}
									placeholder="+1 (555) 000-0000"
									className={cn(
										"",
										state?.errors?.phone && "border-red-500 ring-red-100"
									)}
								/>
								{state?.errors?.phone && (
									<p className="text-red-500 text-sm">
										{state.errors.phone[0]}
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-primary/30 shadow-lg">
					<CardHeader className="space-y-1">
						<h3 className="text-lg font-semibold tracking-tight">
							Address Information
						</h3>
						<p className="text-sm text-muted-foreground">
							Specify the client&apos;s location details
						</p>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="space-y-2">
							<Label htmlFor="address" className="font-medium">
								Street Address
							</Label>
							<Input
								id="address"
								name="address"
								defaultValue={state?.inputs?.address}
								placeholder="123 Business Street"
								className={cn(
									"",
									state?.errors?.address && "border-red-500 ring-red-100"
								)}
							/>
							{state?.errors?.address && (
								<p className="text-red-500 text-sm">
									{state.errors.address[0]}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city" className="font-medium">
									City
								</Label>
								<Input
									id="city"
									name="city"
									defaultValue={state?.inputs?.city}
									placeholder="City"
									className={cn(
										"",
										state?.errors?.city && "border-red-500 ring-red-100"
									)}
								/>
								{state?.errors?.city && (
									<p className="text-red-500 text-sm">{state.errors.city[0]}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="zipCode" className="font-medium">
									ZIP Code
								</Label>
								<Input
									id="zipCode"
									name="zipCode"
									defaultValue={state?.inputs?.zipCode}
									placeholder="ZIP Code"
									className={cn(
										"",
										state?.errors?.zipCode && "border-red-500 ring-red-100"
									)}
								/>
								{state?.errors?.zipCode && (
									<p className="text-red-500 text-sm">
										{state.errors.zipCode[0]}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="country" className="font-medium">
									Country
								</Label>
								<Input
									id="country"
									name="country"
									defaultValue={state?.inputs?.country}
									placeholder="Country"
									className={cn(
										"",
										state?.errors?.country && "border-red-500 ring-red-100"
									)}
								/>
								{state?.errors?.country && (
									<p className="text-red-500 text-sm">
										{state.errors.country[0]}
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-2 border-l-4 border-l-primary/20 shadow-lg">
					<CardHeader className="space-y-1">
						<h3 className="text-lg font-semibold tracking-tight">
							Additional Information
						</h3>
						<p className="text-sm text-muted-foreground">
							Add any extra details about the client
						</p>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="notes" className="font-medium">
								Notes
							</Label>
							<Textarea
								id="notes"
								name="notes"
								defaultValue={state?.inputs?.notes}
								placeholder="Enter any additional notes about the client"
								className={cn(
									"min-h-[120px] resize-y",
									state?.errors?.notes && "border-red-500 ring-red-100"
								)}
							/>
							{state?.errors?.notes && (
								<p className="text-red-500 text-sm">{state.errors.notes[0]}</p>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4 items-center bg-muted/50 rounded-lg p-4">
					<p className="text-sm text-muted-foreground order-2 sm:order-1">
						Fields marked with <span className="text-red-500">*</span> are
						required
					</p>
					<div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
						<Link href="/dashboard/clients">
							<Button
								type="button"
								variant="outline"
								disabled={isPending}
								className="flex-1 sm:flex-none"
							>
								Cancel
							</Button>
						</Link>
						<Button
							type="submit"
							disabled={isPending}
							className="flex-1 sm:flex-none relative"
						>
							{isPending ? "Creating..." : "Create Client"}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
