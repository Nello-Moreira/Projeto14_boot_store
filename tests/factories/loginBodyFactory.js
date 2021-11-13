import faker from 'faker';
faker.locale = 'pt_BR';

function loginBodyFactory(user) {
	return {
		email: user.email,
		password: user.password,
	};
}

function invalidLoginEmailFactory() {
	return {
		email: faker.random.alphaNumeric(10),
		password: faker.internet.password(6),
	};
}

function wrongLoginPasswordFactory(existingUser) {
	return {
		email: existingUser.email,
		password: faker.internet.password(10),
	};
}

export {
	loginBodyFactory,
	invalidLoginEmailFactory,
	wrongLoginPasswordFactory,
};
