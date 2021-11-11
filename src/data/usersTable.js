import dbConnection from './connection.js';

const searchUserByParam = (param, paramValue) =>
	dbConnection.query(`SELECT * FROM users WHERE ${param} = $1`, [paramValue]);

const insertUser = ({ uuid, name, email, password, avatarUrl }) =>
	dbConnection.query(
		`
    INSERT INTO users
    (uuid, name, email, password, avatar_url)
    VALUES
    ($1, $2, $3, $4, $5)
`,
		[uuid, name, email, password, avatarUrl]
	);

const deleteAllUsers = () => dbConnection.query('DELETE FROM users');

export { searchUserByParam, insertUser, deleteAllUsers };
