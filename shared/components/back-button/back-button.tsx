"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui";

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
		<Button
			onClick={handleClick}
			disabled={isPending}
			variant="outline"
			size="icon"
			asChild
		>
			<ArrowLeft />
			{label && <span>{label}</span>}
		</Button>
	);
}
