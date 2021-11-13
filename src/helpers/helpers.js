import { searchSession } from '../data/sessionsTable.js';

const productsPerPage = 16;

const getOffset = (page = 1) => productsPerPage * (page - 1);

const internalErrorResponse = (response, error) => {
	console.log(error);
	return response
		.status(500)
		.send('There was an internal error. Please try again later.');
};

const createRandomInteger = (min, max) =>
	Math.floor(Math.random() * (max - min)) + min;

const isValidSession = async (userId, token) => {
	const existingSession = await searchSession(userId, token);
	if (existingSession.rowCount === 1) return true;
	return false;
};

export {
	productsPerPage,
	getOffset,
	internalErrorResponse,
	createRandomInteger,
	isValidSession,
};
