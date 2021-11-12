import dbConnection from './connection.js';

function insertUser(user) {
	return dbConnection.query(
		`
        INSERT INTO users
        (uuid, name, email, password, avatar_url)
        VALUES ($1, $2, $3, $4, $5)
		RETURNING id;
    `,
		[user.uuid, user.name, user.email, user.password, user.avatar_url]
	);
}

function deleteAllUsers() {
	return dbConnection.query('DELETE FROM users;');
}

export { insertUser, deleteAllUsers };
