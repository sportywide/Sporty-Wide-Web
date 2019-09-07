import { setupConnection } from '@schema-test/setup';
import { Connection, QueryRunner } from 'typeorm';
import { Post } from '@schema-test/entities/post.entity';
import { SwSubscriber } from '@schema/core/subscriber/sql/base.subscriber';
import { getSwRepository, SwQueryBuilder, SwRepository } from '@schema/core/repository/sql/base.repository';
import { Category } from '@schema-test/entities/category.entity';

describe('SwBaseRepository', () => {
	let connection: Connection, subscriber: SwSubscriber, queryRunner: QueryRunner;
	beforeAll(async () => {
		connection = await setupConnection();
		subscriber = new SwSubscriber();
		connection.subscribers.push(subscriber);
	});
	beforeEach(async () => {
		queryRunner = connection.createQueryRunner();
		await queryRunner.startTransaction();
		jest.spyOn(subscriber, 'afterUpdateEntities');
		jest.spyOn(subscriber, 'afterSaveEntities');
		jest.spyOn(subscriber, 'afterRemoveEntities');
		jest.spyOn(subscriber, 'afterInsertEntities');
	});
	afterEach(async () => {
		await queryRunner.rollbackTransaction();
	});
	describe('#increment()', () => {
		it('should increment the number and invoke afterUpdateEntities and afterSaveEntities', async () => {
			const postRepository = getSwRepository(connection, Post);
			await postRepository.increment({ id: 1 }, 'numViews', 3);
			const post: Post | undefined = await postRepository.findOne({ id: 1 });
			expect(post!.numViews).toEqual(3);
			assertSaveHooksCalled({
				tableName: 'post',
				ids: [1],
			});
		});
	});

	describe('#decrement()', () => {
		it('should decrement the number and invoke afterUpdateEntities and afterSaveEntities', async () => {
			const postRepository = getSwRepository(connection, Post);
			await postRepository.decrement({ id: 1 }, 'numViews', -2);
			const post: Post | undefined = await postRepository.findOne({ id: 1 });
			expect(post!.numViews).toEqual(2);
			assertSaveHooksCalled({
				tableName: 'post',
				ids: [1],
			});
		});
	});

	describe('#update()', () => {
		it('should update the data and invoke afterUpdateEntities and afterSaveEntities', async () => {
			const categoryRepository = getSwRepository(connection, Category);
			await categoryRepository.update([1, 2], {
				name: 'Test',
			});
			const categories: Category[] = await categoryRepository.find();
			expect(categories.map(({ name }) => name)).toEqual(['Test', 'Test']);
			assertSaveHooksCalled({
				tableName: 'category',
				ids: [1, 2],
			});
		});
	});

	describe('#getTableName()', () => {
		it('should return the correct table name', () => {
			const categoryRepository = getSwRepository(connection, Category);
			expect(categoryRepository.getTableName()).toEqual('category');
		});
	});

	describe('#getTableNameForEntity()', () => {
		it('should return the correct table name for the given entity', () => {
			const categoryRepository = getSwRepository(connection, Category);
			expect(categoryRepository.getTableNameForEntity(Post)).toEqual('post');
		});
	});

	describe('#delete()', () => {
		it('should delete the entity and call the hooks', async () => {
			const categoryRepository = getSwRepository(connection, Category);
			await categoryRepository.delete([1, 2]);
			const categories = await categoryRepository.find();
			expect(categories.length).toBe(0);
			assertDeleteHooksCalled({
				tableName: 'category',
				ids: [1, 2],
			});
		});
	});

	describe('#advanceFind()', () => {
		it('should find the entities given the conditions', async () => {
			const categoryRepository = getSwRepository(connection, Category);
			const actualCategories = await categoryRepository.advancedFind([1, 2]);
			const expectedCategories = await categoryRepository.find();
			expect(actualCategories.length).toBe(2);
			expect(actualCategories).toEqual(expectedCategories);
		});
	});

	describe('#advanceFindIds()', () => {
		it('should return the entities id given the conditions', async () => {
			const categoryRepository = getSwRepository(connection, Category);
			const actualCategories = await categoryRepository.advancedFindIds({
				name: 'TypeScript',
			});
			expect(actualCategories.length).toBe(1);
			expect(actualCategories).toEqual([1]);
		});
	});

	describe('SwQueryBuilder', () => {
		let postRepository: SwRepository<Post>, queryBuilder: SwQueryBuilder<Post>;

		beforeEach(() => {
			postRepository = getSwRepository(connection, Post);
			queryBuilder = postRepository.createQueryBuilder();
		});

		describe('#select', () => {
			it('should return the right data', async () => {
				const actualPost = await queryBuilder
					.select()
					.where('id = :id', { id: 1 })
					.getOne();
				const expectedPost = await postRepository.findOne(1);
				expect(actualPost).toEqual(expectedPost);
			});
		});
		describe('#update', () => {
			it('should update the data and call the hooks', async () => {
				await queryBuilder
					.update()
					.set({
						title: 'Test',
					})
					.where('id = :id', { id: 1 })
					.execute();
				const expectedPost = await postRepository.findOne(1);
				expect(expectedPost!.title).toEqual('Test');
				assertSaveHooksCalled({ tableName: 'post', ids: [1] });
			});
		});
		describe('#delete', () => {
			it('should delete the entity and call the hooks', async () => {
				await queryBuilder
					.delete()
					.where('id = :id', { id: 1 })
					.execute();
				const expectedPost = await postRepository.findOne(1);
				expect(expectedPost).toBeUndefined();
				assertDeleteHooksCalled({ tableName: 'post', ids: [1] });
			});
		});
		describe('#insert', () => {
			it('should insert the new entity and call the hooks', async () => {
				await queryBuilder
					.insert()
					.values({ title: 'New Post', text: 'Text' })
					.execute();
				const postCount = await postRepository.count();
				expect(postCount).toBe(2);
				assertInsertHooksCalled({ tableName: 'post', ids: [2] });
			});
		});
	});

	function assertSaveHooksCalled({ tableName, ids }) {
		expect(subscriber.afterUpdateEntities).toHaveBeenCalledWith({
			tableName,
			ids,
		});
		expect(subscriber.afterSaveEntities).toHaveBeenCalledWith({
			tableName,
			ids,
		});
	}

	function assertInsertHooksCalled({ tableName, ids }) {
		expect(subscriber.afterInsertEntities).toHaveBeenCalledWith({
			tableName,
			ids,
		});
		expect(subscriber.afterSaveEntities).toHaveBeenCalledWith({
			tableName,
			ids,
		});
	}

	function assertDeleteHooksCalled({ tableName, ids }) {
		expect(subscriber.afterRemoveEntities).toHaveBeenCalledWith({
			tableName,
			ids,
		});
	}
});
