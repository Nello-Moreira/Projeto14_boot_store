import faker from 'faker';
faker.locale = 'pt_BR';

export default function uuidFactory() {
	return faker.datatype.uuid();
}
