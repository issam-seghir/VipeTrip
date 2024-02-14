//* ------------------- Mock a user schema  with fakerJs -------------------
//? add many fake schema data to the database (mongoose )
//? source : https://www.mongodb.com/developer/products/mongodb/seed-database-with-fake-data/

const { faker } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");

const uniqueEnforcerEmail = new UniqueEnforcer();

function generateUserSchemaData() {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const email = uniqueEnforcerEmail.enforce(() => {
		return faker.internet.email({ firstName, lastName });
	});

	return {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: faker.internet.password(),
		picturePath: faker.image.avatar(),
		coverPath: faker.image.urlPlaceholder(),
		totalPosts: faker.number.int({ min: 0, max: 100 }),
		location: faker.location.country(),
		job: faker.person.jobTitle(),
		viewedProfile: faker.number.int({ min: 1, max: 1000 }),
		impressions: faker.number.int({ min: 1, max: 1000 }),
	};
}

module.exports = { generateUserSchemaData };

//* ------------------- Mock a user schema  with zod-mock -------------------
