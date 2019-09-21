import path from 'path';
import fs from 'fs';
import { mkdirs } from 'fs-extra';
import { prompt } from '../helpers/inquirer';

const VERSION = '1.0.0';

generateMigration().then(() => {
	console.info('Migration created!');
});

async function generateMigration() {
	const migrationName = await prompt('Migration name: ');
	const migrationFolder = path.resolve(__dirname, '..', 'sql', `${getISODateString()}-${migrationName}`);
	mkdirs(migrationFolder);
	const version = getVersion();
	const migrationFile = path.resolve(migrationFolder, `U${version}__${migrationName}.sql`);
	fs.writeFileSync(migrationFile, '', {
		encoding: 'utf8',
	});
	console.info(`Created ${migrationFile}`);
	const undoMigrationFile = path.resolve(migrationFolder, `V${version}__${migrationName}.sql`);
	fs.writeFileSync(undoMigrationFile, '', {
		encoding: 'utf8',
	});
	console.info(`Created ${undoMigrationFile}`);
}

function getVersion() {
	return `${VERSION}.${getTimestamp()}`;
}

function getTimestamp() {
	const date = new Date();
	return (
		pad(date.getFullYear(), 4) +
		pad(date.getMonth() + 1, 2) +
		pad(date.getDate(), 2) +
		pad(date.getHours(), 2) +
		pad(date.getMinutes(), 2)
	);
}

function getISODateString() {
	const date = new Date();
	return pad(date.getFullYear(), 4) + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2);
}

function pad(value, length) {
	return value.toString().padStart(length, '0');
}
