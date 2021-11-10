import faker from 'faker';

export default function stringFactory() {
	const string = faker.random.alphaNumeric(30);
	return string;
}
