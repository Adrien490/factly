import { Button } from "@/shared/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Filter } from "lucide-react";
export function ClientFilterSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Filter className="size-4" />
					Filtres
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Filtrer les clients</SheetTitle>
					<SheetDescription>
						Filtrez les clients en fonction de vos besoins.
					</SheetDescription>
				</SheetHeader>
				<div></div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
