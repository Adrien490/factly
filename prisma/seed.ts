import { fakerFR as faker } from "@faker-js/faker";
import {
	AddressType,
	Civility,
	ClientStatus,
	ClientType,
	LegalForm,
	PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const ORGANIZATION_ID = "cm5o0gb576786ygv4kdgejaom";
const USER_ID = "cm5o0gb570000ygv4kdgejaom";

async function main() {
	// Suppression des clients existants pour cette organisation
	await prisma.client.deleteMany({
		where: { organizationId: ORGANIZATION_ID },
	});

	// Création de 50 clients
	const clients = Array.from({ length: 250 }, () => {
		const isCompany = Math.random() > 0.5;
		const status = faker.helpers.arrayElement(Object.values(ClientStatus));

		return {
			organizationId: ORGANIZATION_ID,
			userId: USER_ID,
			name: isCompany
				? faker.company.name()
				: `${faker.person.firstName()} ${faker.person.lastName()}`,
			email: faker.internet.email(),
			phone: faker.phone.number(),
			clientType: isCompany ? ClientType.COMPANY : ClientType.INDIVIDUAL,
			status,
			reference: faker.string.alphanumeric(8).toUpperCase(),
			civility: isCompany
				? null
				: faker.helpers.arrayElement(Object.values(Civility)),
			website: isCompany ? faker.internet.url() : null,
			siren: isCompany ? faker.string.numeric(9) : null,
			siret: isCompany ? faker.string.numeric(14) : null,
			vatNumber: isCompany ? `FR${faker.string.numeric(11)}` : null,
			legalForm: isCompany
				? faker.helpers.arrayElement(Object.values(LegalForm))
				: null,
			createdAt: faker.date.past({ years: 2 }),
			updatedAt: faker.date.recent({ days: 30 }),
		};
	});

	// Insertion des clients
	for (const client of clients) {
		const createdClient = await prisma.client.create({
			data: {
				...client,
				addresses: {
					create: [
						{
							addressType: AddressType.DELIVERY,
							line1: faker.location.streetAddress(),
							line2:
								Math.random() > 0.7 ? faker.location.secondaryAddress() : null,
							zipCode: faker.location.zipCode(),
							city: faker.location.city(),
							country: "FR",
							isDefault: true,
						},
					],
				},
			},
		});

		// Ajout d'une adresse de facturation pour certains clients
		if (Math.random() > 0.7) {
			await prisma.address.create({
				data: {
					clientId: createdClient.id,
					addressType: AddressType.BILLING,
					line1: faker.location.streetAddress(),
					line2: Math.random() > 0.7 ? faker.location.secondaryAddress() : null,
					zipCode: faker.location.zipCode(),
					city: faker.location.city(),
					country: "FR",
					isDefault: true,
				},
			});
		}
	}

	console.log("✅ Base de données peuplée avec succès");
}

main()
	.catch((e) => {
		console.error("❌ Erreur lors du peuplement de la base de données:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
