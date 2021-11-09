import dbConnection from './connection.js';

const searchAllCategories = () =>
	dbConnection.query('SELECT name FROM categories ORDER BY name');

export default searchAllCategories;
