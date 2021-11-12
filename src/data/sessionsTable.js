import dbConnection from './connection.js';

const searchSession = (userId, token) =>
	dbConnection.query(
		`SELECT 
		users.id, users.name, users.email, users.avatar_url
		FROM users
		JOIN sessions
			ON sessions.user_id = users.id
		WHERE
			users.uuid  = '$1' AND
			sessions.token= '$2';`,
		[userId, token]
	);

const insertSession = (userId, token) =>
	dbConnection.query(
		`
        INSERT INTO sessions (user_id, token)
        VALUES ($1, $2);
    `,
		[userId, token]
	);

const deleteAllSessions = () => dbConnection.query('DELETE FROM sessions;');

function getToken(token) {
	return dbConnection.query('SELECT FROM sessions WHERE token = $1', [token]);
}

export { searchSession, insertSession, deleteAllSessions, getToken };
