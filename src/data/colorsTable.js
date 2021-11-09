import dbConnection from './connection.js';

const insertColor = (colorName) =>
	dbConnection.query('INSERT INTO colors (name) VALUES ($1) RETURNING id;', [
		colorName,
	]);

const deleteAllColors = () => dbConnection.query('DELETE FROM colors;');

export { insertColor, deleteAllColors };
