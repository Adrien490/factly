/**
 * Exemple d'utilisation des variables de couleur des graphiques avec Tailwind CSS v4
 *
 * Dans Tailwind CSS v4, les variables de couleur sont accessibles via les propriétés CSS
 * et peuvent être utilisées directement dans les styles inline ou avec des utilitaires.
 */

// Composant BarChart simple pour illustrer l'utilisation des couleurs
function BarChart() {
	// Données factices pour notre graphique
	const data = [65, 40, 80, 50, 70];
	const maxValue = Math.max(...data);

	return (
		<div className="flex items-end h-40 gap-4">
			{data.map((value, index) => (
				<div
					key={index}
					className="w-12 rounded-t overflow-hidden flex-grow"
					style={{
						height: `${(value / maxValue) * 100}%`,
						backgroundColor: `var(--color-chart-${index + 1})`,
					}}
					aria-label={`Valeur: ${value}`}
				/>
			))}
		</div>
	);
}

// Composant PieChart simple
function PieChart() {
	return (
		<div className="relative size-40">
			<svg viewBox="0 0 100 100" className="size-full">
				{/* Segment 1 (40%) */}
				<circle
					cx="50"
					cy="50"
					r="40"
					stroke-dasharray="251.2 1000"
					stroke-dashoffset="0"
					stroke="var(--color-chart-1)"
					stroke-width="20"
					fill="none"
					className="origin-center -rotate-90"
				/>

				{/* Segment 2 (30%) */}
				<circle
					cx="50"
					cy="50"
					r="40"
					stroke-dasharray="188.4 1000"
					stroke-dashoffset="-251.2"
					stroke="var(--color-chart-2)"
					stroke-width="20"
					fill="none"
					className="origin-center -rotate-90"
				/>

				{/* Segment 3 (15%) */}
				<circle
					cx="50"
					cy="50"
					r="40"
					stroke-dasharray="94.2 1000"
					stroke-dashoffset="-439.6"
					stroke="var(--color-chart-3)"
					stroke-width="20"
					fill="none"
					className="origin-center -rotate-90"
				/>

				{/* Segment 4 (10%) */}
				<circle
					cx="50"
					cy="50"
					r="40"
					stroke-dasharray="62.8 1000"
					stroke-dashoffset="-533.8"
					stroke="var(--color-chart-4)"
					stroke-width="20"
					fill="none"
					className="origin-center -rotate-90"
				/>

				{/* Segment 5 (5%) */}
				<circle
					cx="50"
					cy="50"
					r="40"
					stroke-dasharray="31.4 1000"
					stroke-dashoffset="-596.6"
					stroke="var(--color-chart-5)"
					stroke-width="20"
					fill="none"
					className="origin-center -rotate-90"
				/>
			</svg>
		</div>
	);
}

// Légende des couleurs
function ColorLegend() {
	const items = [
		{ label: "Revenu principal", color: "var(--color-chart-1)" },
		{ label: "Dépenses fixes", color: "var(--color-chart-2)" },
		{ label: "Investissements", color: "var(--color-chart-3)" },
		{ label: "Loisirs", color: "var(--color-chart-4)" },
		{ label: "Divers", color: "var(--color-chart-5)" },
	];

	return (
		<div className="space-y-2">
			{items.map((item, index) => (
				<div key={index} className="flex items-center gap-2">
					<div
						className="size-4 rounded-sm"
						style={{ backgroundColor: item.color }}
					/>
					<span className="text-sm">{item.label}</span>
				</div>
			))}
		</div>
	);
}

// Page d'exemple principale
export default function ChartExamples() {
	return (
		<div className="p-8 space-y-12">
			<h1 className="text-2xl font-bold">
				Utilisation des couleurs de graphiques avec Tailwind CSS v4
			</h1>

			<section>
				<h2 className="text-xl font-semibold mb-4">
					Variables de couleur disponibles
				</h2>
				<div className="grid grid-cols-5 gap-4">
					{[1, 2, 3, 4, 5].map((num) => (
						<div key={num} className="flex flex-col items-center">
							<div
								className="size-16 rounded-md mb-2"
								style={{ backgroundColor: `var(--color-chart-${num})` }}
							/>
							<code className="text-sm bg-muted px-2 py-1 rounded">
								--color-chart-{num}
							</code>
						</div>
					))}
				</div>
			</section>

			<div className="grid md:grid-cols-2 gap-8">
				<section>
					<h2 className="text-xl font-semibold mb-4">Graphique à barres</h2>
					<div className="p-4 border border-border rounded-lg">
						<BarChart />
					</div>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-4">Graphique circulaire</h2>
					<div className="p-4 border border-border rounded-lg flex justify-between items-center">
						<PieChart />
						<ColorLegend />
					</div>
				</section>
			</div>

			<section className="p-4 border border-border rounded-lg bg-card">
				<h2 className="text-xl font-semibold mb-2">Utilisation dans le code</h2>
				<pre className="p-4 bg-muted rounded overflow-x-auto">
					<code>
						{`// Accès direct aux variables CSS
<div style={{ backgroundColor: 'var(--color-chart-1)' }} />

// Avec Tailwind, combiné avec le style inline
<div className="rounded-md p-4" style={{ backgroundColor: 'var(--color-chart-2)' }} />

// Exemple pratique avec des données dynamiques
const chartColors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

// Dans un composant React
{data.map((item, index) => (
  <div 
    key={index}
    style={{ backgroundColor: chartColors[index % chartColors.length] }}
  />
))}`}
					</code>
				</pre>
			</section>
		</div>
	);
}
