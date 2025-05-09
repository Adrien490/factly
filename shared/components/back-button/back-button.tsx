"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

interface Props {
	label?: string;
}

export function BackButton({ label }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(() => {
			router.back();
		});
	};
	return (
		<Button onClick={handleClick} disabled={isPending} variant="ghost" asChild>
			<div className="flex items-center gap-2">
				<ArrowLeft />
				{label && <span>{label}</span>}
			</div>
		</Button>
	);
}
