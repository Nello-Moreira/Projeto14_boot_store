import faker from 'faker';
faker.locale = 'pt_BR';

const colorFactory = () => ({
	name: faker.commerce.color(),
});

export default colorFactory;
