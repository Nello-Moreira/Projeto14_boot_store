import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createEnvs = ({ username, password, databaseName }) => {
	const pathToCreate = __dirname.split('/').slice(0, -1).join('/');

	const writeEnvsData = env => {
		try {
			fs.writeFileSync(
				`${
					env ? `${pathToCreate}/.env.${env}` : `${pathToCreate}/.env`
				}`,
				`DB_USER=${username}\nDB_PASSWORD=${password}\nDB_PORT=5432\nDB_HOST=localhost\nDB_DATABASE=${
					env ? `${databaseName}_${env}` : `${databaseName}`
				}\nPORT=8080
                `
			);
		} catch (error) {
			console.log(error);
		}
	};

	writeEnvsData();
	writeEnvsData('development');
	writeEnvsData('test');
};

export { createEnvs };
