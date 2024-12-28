"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/lib/types/server-action";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert } from "lucide-react";

type ServerActionResultProps<TData = void, TInput = void> = {
	response: ServerActionState<TData, TInput> | null;
};

export default function ServerActionResult<TData = void, TInput = void>({
	response,
}: ServerActionResultProps<TData, TInput>) {
	if (!response || response.status === ServerActionStatus.SUCCESS) return null;

	return (
		<div className="md:col-span-2 mb-4">
			<div className="bg-card border-l-4 text-sm rounded-lg p-4">
				<div className="flex items-center gap-2">
					{response.status === ServerActionStatus.ERROR && (
						<AlertTriangle className="text-red-500 w-5 h-5" />
					)}
					{response.status === ServerActionStatus.UNAUTHORIZED && (
						<ShieldAlert className="text-yellow-500 w-5 h-5" />
					)}
					<p
						className={cn(
							"text-sm",
							response.status === ServerActionStatus.ERROR && "text-red-500",
							response.status === ServerActionStatus.UNAUTHORIZED &&
								"text-yellow-500"
						)}
					>
						{response.message}
					</p>
				</div>
			</div>
		</div>
	);
}
