import { createRandomInteger } from '../../src/helpers/helpers.js';
import faker from 'faker';
faker.locale = 'pt_BR';

function validSignUpBodyFactory() {
	const name = faker.name.firstName();

	return {
		name,
		email: faker.internet.email(name),
		password: faker.internet.password(6),
		avatarUrl: faker.image.avatar(),
	};
}

function invalidSignUpBodyFactory() {
	const validBody = validSignUpBodyFactory();
	const randomNumber = faker.datatype.number();

	const invalidBodies = [
		{ ...validBody, name: randomNumber },
		{ ...validBody, email: randomNumber },
		{ ...validBody, password: randomNumber },
		{ ...validBody, avatarUrl: randomNumber },
		{ ...validBody, newKey: randomNumber },
	];

	const selectedBodyIndex = createRandomInteger(0, invalidBodies.length - 1);

	return invalidBodies[selectedBodyIndex];
}

export { validSignUpBodyFactory, invalidSignUpBodyFactory };
