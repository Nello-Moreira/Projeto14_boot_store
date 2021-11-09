import connection from '../data/connection.js';

function endConnection() {
	connection.end();
}

export default endConnection;
