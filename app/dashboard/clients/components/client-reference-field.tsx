"use client";

import checkClientReference from "@/api/client/check-client-reference";
import { generateReference } from "@/api/client/generate-reference";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useToast } from "@/hooks/use-toast";
import { ServerActionStatus } from "@/lib/types/server-action";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Wand2, XCircle } from "lucide-react";
import { useActionState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

type ClientReferenceFieldProps = {
	defaultValue?: string;
	error?: string[];
};

export function ClientReferenceField({
	defaultValue,
	error,
}: ClientReferenceFieldProps) {
	const [checkState, checkAction] = useActionState(checkClientReference, null);
	const [isCheckingRef, startCheckTransition] = useTransition();
	const { toast } = useToast();
	const { shouldLimit } = useRateLimit({
		limit: 500,
		onLimit: () =>
			toast({
				title: "You're generating references too quickly",
				variant: "destructive",
			}),
	});

	const check = (value: string) => {
		const formData = new FormData();
		formData.append("reference", value);
		startCheckTransition(() => checkAction(formData));
	};

	const debouncedCheck = useDebouncedCallback((value: string) => {
		check(value);
	}, 500);

	const generate = async () => {
		if (shouldLimit()) return;
		try {
			const reference = await generateReference({
				format: "alphanumeric",
				length: 3,
			});

			const input = document.getElementById("reference") as HTMLInputElement;
			if (input) {
				input.value = reference;
				check(reference);
			}
		} catch (error) {
			toast({
				title: "Error generating reference",
				description: error as string,
				duration: 5000,
			});
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="reference" className="font-medium">
				Reference <span className="text-red-500">*</span>
			</Label>
			<div className="relative flex gap-2">
				<div className="relative flex-1">
					<Input
						id="reference"
						name="reference"
						defaultValue={defaultValue}
						placeholder="Enter a reference or generate one automatically"
						className={cn("pr-10", error && "border-red-500")}
						onChange={(e) => debouncedCheck(e.target.value)}
					/>
					<div className="absolute right-3 top-2.5">
						{isCheckingRef ? (
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						) : checkState?.status === ServerActionStatus.SUCCESS ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<CheckCircle2 className="h-5 w-5 text-green-500" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm text-green-500">{checkState.message}</p>
								</TooltipContent>
							</Tooltip>
						) : checkState?.status === ServerActionStatus.VALIDATION_ERROR ||
						  checkState?.status === ServerActionStatus.ERROR ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<XCircle className="h-5 w-5 text-red-500" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm text-red-500">{checkState.message}</p>
									{Array.isArray(checkState.errors) &&
										checkState.errors.map((error: string, index: number) => (
											<p key={index} className="text-sm text-red-500">
												{error}
											</p>
										))}
								</TooltipContent>
							</Tooltip>
						) : null}
					</div>
				</div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={generate}
								className="flex-shrink-0"
							>
								<Wand2 className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Générer une référence</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{error?.map((message, index) => (
				<p key={index} className="text-red-500 text-sm">
					{message}
				</p>
			))}
		</div>
	);
}
