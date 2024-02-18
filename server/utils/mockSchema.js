//* ------------------- Mock a user schema  with fakerJs -------------------
//? add many fake schema data to the database (mongoose )
//? source : https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/

const { faker } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");

const uniqueEnforcerEmail = new UniqueEnforcer();

function generateMockUser() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const email = uniqueEnforcerEmail.enforce(() => {
		return faker.internet.email({ firstName, lastName });
	});

	return {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: faker.internet.password({ min: 8, max: 20 }),
		// picturePath: faker.image.avatar(),
		// coverPath: faker.image.urlPlaceholder(),
		// totalPosts: faker.number.int({ min: 0, max: 100 }),
		location: faker.location.country({ min: 3, max: 25 }),
		job: faker.person.jobTitle({ min: 3, max: 25 }),
		// viewedProfile: faker.number.int({ min: 1, max: 1000 }),
		// impressions: faker.number.int({ min: 1, max: 1000 }),
	};
}

module.exports = { generateMockUser };

//* ------------------- Mock a user schema  with zod-mock -------------------
//? Alternative : zocker , zod-schema-faker

const { generateMock } = require("@anatine/zod-mock");
const { registerSchema } = require("@validations/authSchema");

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = uniqueEnforcerEmail.enforce(() => {
	return faker.internet.email({ firstName, lastName });
});
const location = faker.location.country();
const job = faker.person.jobTitle();

const mockUser = generateMock(registerSchema.body, {
	stringMap: {
		firstName: () => firstName,
		lastName: () => lastName,
		email: () => email,
		job: () => job,
		location: () => location,
		confirmPassword: () => "",
	},
	backupMocks: {
		ZodAny: () => "a value",
	},
});
console.log(JSON.stringify(mockUser));

module.exports = { mockUser };
