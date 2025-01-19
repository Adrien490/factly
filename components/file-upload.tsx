"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface FileUploadProps {
	onChange: (url?: string) => void;
	value?: string;
	endpoint: "imageUploader" | "organizationLogo";
	className?: string;
}

export function FileUpload({
	onChange,
	value,
	endpoint,
	className,
}: FileUploadProps) {
	const [progress, setProgress] = useState(0);

	const onComplete = useCallback(
		(res: { url: string }[]) => {
			const url = res[0]?.url;
			if (url) {
				onChange(url);
				toast.success("Fichier téléchargé avec succès");
			}
		},
		[onChange]
	);

	const onUploadProgress = useCallback((progress: number) => {
		setProgress(progress);
	}, []);

	const onRemove = useCallback(() => {
		onChange(undefined);
	}, [onChange]);

	if (value) {
		return (
			<div className={cn("relative w-52 h-52", className)}>
				<div className="relative aspect-square w-full h-full rounded-lg overflow-hidden border border-border">
					<Image
						src={value}
						alt="Uploaded file"
						className="object-cover"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
				<Button
					onClick={onRemove}
					variant="destructive"
					size="icon"
					className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className={cn("w-full", className)}>
			<UploadDropzone
				endpoint={endpoint}
				onClientUploadComplete={onComplete}
				onUploadProgress={onUploadProgress}
				onUploadError={(error: Error) => {
					toast.error(`Erreur: ${error.message}`);
				}}
				className="ut-label:text-lg ut-allowed-content:text-muted-foreground ut-button:ut-uploading:cursor-not-allowed border-2 border-dashed"
			/>
			{progress > 0 && progress < 100 && (
				<div className="mt-4 w-full space-y-2">
					<Progress value={progress} className="h-1 w-full" />
					<p className="text-sm text-muted-foreground text-center">
						{progress}%
					</p>
				</div>
			)}
		</div>
	);
}
