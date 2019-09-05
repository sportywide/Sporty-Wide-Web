import { camelcaseToDashcase, camelcaseToSnakecase, toCamel, ucfirst } from '@shared/lib/utils/string/conversion';

describe('Testing string conversion', () => {
	describe('Testing ucfirst', () => {
		test('should leave empty string intact', () => {
			expect(ucfirst('')).toBe('');
		});

		test('should convert first character to uppercase', () => {
			expect(ucfirst('test here')).toBe('Test here');
		});
	});

	describe('Testing camelcaseToSnakecase', () => {
		test('should convert camel case to snake case', () => {
			expect(camelcaseToSnakecase('testHere')).toBe('test_here');
		});
	});

	describe('Testing camelcaseToDashcase', () => {
		test('should convert camel case to dash case', () => {
			expect(camelcaseToDashcase('testHere')).toBe('test-here');
		});
	});

	describe('Testing toCamelcase', () => {
		test('should convert dash case to camel case', () => {
			expect(toCamel('test-here')).toBe('testHere');
		});

		test('should convert snake case to camel case', () => {
			expect(toCamel('test_here')).toBe('testHere');
		});
	});
});
