"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { File, Folder, FolderOpen } from "lucide-react";
import { useCallback } from "react";

type FileItem = {
	id: string;
	name: string;
	type: "file" | "folder";
	children?: FileItem[];
};

export default function AccordionTestPage() {
	const fileTree: FileItem[] = [
		{
			id: "1",
			name: "Documents",
			type: "folder",
			children: [
				{
					id: "2",
					name: "Work",
					type: "folder",
					children: [
						{ id: "3", name: "report.pdf", type: "file" },
						{ id: "4", name: "presentation.pptx", type: "file" },
						{
							id: "11",
							name: "Nested Folder",
							type: "folder",
							children: [
								{ id: "12", name: "nested-file1.txt", type: "file" },
								{ id: "13", name: "nested-file2.txt", type: "file" },
								{
									id: "14",
									name: "Deep Nested",
									type: "folder",
									children: [{ id: "15", name: "very-deep.txt", type: "file" }],
								},
							],
						},
					],
				},
				{ id: "5", name: "resume.docx", type: "file" },
			],
		},
		{
			id: "6",
			name: "Projects",
			type: "folder",
			children: [
				{
					id: "7",
					name: "Website",
					type: "folder",
					children: [
						{ id: "8", name: "index.html", type: "file" },
						{ id: "9", name: "styles.css", type: "file" },
					],
				},
			],
		},
		{ id: "10", name: "notes.txt", type: "file" },
	];

	const renderFileTree = useCallback((items: FileItem[]) => {
		return (
			<Accordion type="multiple" className="w-full">
				{items.map((item: FileItem) => {
					if (item.type === "folder") {
						return (
							<AccordionItem
								key={item.id}
								value={item.id}
								className="border-b-0"
							>
								<AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-muted/50 rounded-md">
									<div className="flex items-center gap-2">
										<FolderOpen className="h-4 w-4 text-blue-500 data-[state=closed]:hidden" />
										<Folder className="h-4 w-4 text-blue-500 data-[state=open]:hidden" />
										<span className="text-sm">{item.name}</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="pl-6">
									{item.children && renderFileTree(item.children)}
								</AccordionContent>
							</AccordionItem>
						);
					} else {
						return (
							<Button
								key={item.id}
								variant="ghost"
								className="w-full justify-start py-1 px-2 mb-1 h-auto"
							>
								<File className="h-4 w-4 mr-2 text-gray-500" />
								<span className="text-sm">{item.name}</span>
							</Button>
						);
					}
				})}
			</Accordion>
		);
	}, []);

	return (
		<div className="max-w-5xl mx-auto p-8">
			<h1 className="text-2xl font-bold mb-8">
				Test d&apos;Accordion imbriqués
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="border rounded-lg p-6 bg-card">
					<h2 className="text-lg font-semibold mb-4">Structure de Fichiers</h2>
					<div className="bg-background rounded-lg border">
						{renderFileTree(fileTree)}
					</div>
				</div>

				<div className="border rounded-lg p-6 bg-card">
					<h2 className="text-lg font-semibold mb-4">Explication</h2>
					<p className="text-muted-foreground mb-4">
						Cette démonstration montre comment imbriquer des accordions pour
						créer une arborescence de fichiers avec une profondeur illimitée.
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>
							Les accordions peuvent être imbriqués à n&apos;importe quelle
							profondeur
						</li>
						<li>Chaque niveau maintient son propre état ouvert/fermé</li>
						<li>
							L&apos;option{" "}
							<code className="bg-muted px-1 rounded">
								type=&quot;multiple&quot;
							</code>{" "}
							permet d&apos;ouvrir plusieurs dossiers à la fois
						</li>
						<li>
							Les icônes changent dynamiquement en fonction de l&apos;état
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
