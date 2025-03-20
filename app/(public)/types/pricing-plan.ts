interface PricingPlan {
	id: string;
	name: string;
	price: {
		monthly: string;
		yearly: string;
	};
	description: string;
	features: string[];
	cta: {
		label: string;
		href: string;
	};
	popular?: boolean;
}

export default PricingPlan;
