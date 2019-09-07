import { Category } from '@schema-test/entities/category.entity';
import { Post } from '@schema-test/entities/post.entity';
import { QueryRunner, MigrationInterface } from 'typeorm';

export class SeedPostCategory1567772263000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		const category1 = new Category();
		category1.name = 'TypeScript';
		await queryRunner.manager.save(category1);

		const category2 = new Category();
		category2.name = 'Programming';
		await queryRunner.manager.save(category2);

		const post = new Post();
		post.title = 'Control flow based type analysis';
		post.text = `TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.`;
		post.categories = [category1, category2];
		await queryRunner.manager.save(post);
	}

	public async down(_: QueryRunner): Promise<any> {
		// do nothing
	}
}
