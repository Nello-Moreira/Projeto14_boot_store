import faker from 'faker';

export default function stringFactory() {
	return faker.random.alphaNumeric(30);
}
