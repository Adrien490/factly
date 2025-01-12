"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Filter as FilterIcon, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

type BaseFilterProps = {
	name: string;
	label: string;
	prefix?: string;
	placeholder?: string;
	className?: string;
	icon?: React.ReactNode;
};

type TextFilterProps = BaseFilterProps & {
	type?: "text" | "email" | "number";
};

type DateFilterProps = BaseFilterProps & {
	type: "date" | "daterange";
};

type SelectFilterProps = BaseFilterProps & {
	type: "select";
	options: { label: string; value: string; icon?: React.ReactNode }[];
	searchable?: boolean;
};

export type FilterFieldProps =
	| TextFilterProps
	| DateFilterProps
	| SelectFilterProps;

export default function FilterField(props: FilterFieldProps) {
	const {
		name,
		label,
		prefix = "filter_",
		className,
		icon = <FilterIcon className="h-4 w-4" />,
	} = props;
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = React.useState(false);

	const paramName = `${prefix}${name}`;

	const { watch, setValue, handleSubmit } = useForm({
		defaultValues: {
			[paramName]: searchParams.get(paramName) || "",
		},
	});

	const debouncedFilter = useDebouncedCallback((value: string) => {
		startTransition(() => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(paramName, value);
			} else {
				params.delete(paramName);
			}
			params.delete("page");
			router.push(`?${params.toString()}`, { scroll: false });
		});
	}, 300);

	const currentValue = watch(paramName);

	const updateFilter = (value: string) => {
		setValue(paramName, value);

		if (props.type === "select") {
			// Mise à jour immédiate pour les select
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(paramName, value);
			} else {
				params.delete(paramName);
			}
			params.delete("page");
			startTransition(() => {
				router.push(`?${params.toString()}`, { scroll: false });
			});
		} else {
			// Debounce pour les champs texte
			debouncedFilter(value);
		}
	};

	const clearFilter = () => {
		setValue(paramName, "");
		startTransition(() => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete(paramName);
			params.delete("page");
			router.push(`?${params.toString()}`, { scroll: false });
		});
		setOpen(false);
	};

	const renderInput = () => {
		switch (props.type) {
			case "date":
				return (
					<div className="flex flex-col gap-2">
						<Input
							type="date"
							value={currentValue}
							onChange={(e) => updateFilter(e.target.value)}
							className="h-8"
						/>
					</div>
				);
			case "select":
				return (
					<Command className="rounded-lg border shadow-md">
						{props.searchable && (
							<CommandInput
								placeholder={props.placeholder || "Rechercher..."}
								className="h-8"
							/>
						)}
						<CommandList>
							<CommandEmpty>Aucun résultat</CommandEmpty>
							<CommandGroup>
								{props.options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={() => {
											updateFilter(option.value);
											setOpen(false);
										}}
										className="flex items-center gap-2"
									>
										<div className="flex items-center gap-2 flex-1">
											{option.icon}
											{option.label}
										</div>
										{currentValue === option.value && (
											<Check className="h-4 w-4 text-primary shrink-0" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				);
			default:
				return (
					<div className="relative">
						<Input
							type={props.type}
							placeholder={props.placeholder}
							value={currentValue}
							onChange={(e) => updateFilter(e.target.value)}
							className="h-8 pr-8"
						/>
						{currentValue && (
							<Button
								variant="ghost"
								size="icon"
								onClick={clearFilter}
								className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Effacer</span>
							</Button>
						)}
					</div>
				);
		}
	};

	const selectedOption =
		props.type === "select"
			? props.options.find((o) => o.value === currentValue)
			: null;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={currentValue ? "default" : "outline"}
					size="sm"
					className={cn(
						"group relative h-8 w-auto min-w-[80px]",
						currentValue && "border-primary font-medium",
						isPending && "opacity-70 cursor-not-allowed",
						className
					)}
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						selectedOption?.icon || icon
					)}
					<span className="ml-2 text-sm">{label}</span>
					{currentValue && (
						<div className="ml-2 inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
							{selectedOption?.label || "1"}
						</div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-72 p-0 shadow-lg backdrop-blur-sm"
				align="start"
				sideOffset={8}
			>
				<div className="flex flex-col gap-4 p-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{selectedOption?.icon || icon}
							<span className="text-sm font-medium">{label}</span>
						</div>
						{currentValue && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilter}
								className="h-7 px-2 text-xs"
							>
								Réinitialiser
							</Button>
						)}
					</div>
					<form
						onSubmit={handleSubmit((data) => {
							debouncedFilter(data[paramName]);
							setOpen(false);
						})}
					>
						{renderInput()}
					</form>
				</div>
			</PopoverContent>
		</Popover>
	);
}
