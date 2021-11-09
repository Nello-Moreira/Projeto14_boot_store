import dbConnection from './connection.js';

const searchAllCategories = () =>
	dbConnection.query('SELECT name FROM categories ORDER BY name');

const insertCategory = (categoryName) =>
	dbConnection.query('INSERT INTO categories (name) values ($1)', [
		categoryName,
	]);

const deleteAllCategories = () => dbConnection.query('DELETE FROM categories');

export { searchAllCategories, insertCategory, deleteAllCategories };
