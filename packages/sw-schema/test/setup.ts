import path from 'path';
import { createConnection } from 'typeorm';
import { Post } from '@schema-test/entities/post.entity';
import { Category } from '@schema-test/entities/category.entity';

export async function setupConnection() {
	const connection = await createConnection({
		type: 'sqlite',
		name: 'memory',
		database: ':memory:',
		entities: [Post, Category],
		migrations: [path.resolve(__dirname, './migrations/**/*.migration.ts')],
		synchronize: true,
		logging: false,
	});
	await connection.runMigrations();
	return connection;
}
