import { normalizePath, getFullPath } from './format';

function mockRequest({ host, protocol }) {
	return {
		get() {
			return host;
		},
		protocol,
	};
}
describe('Testing url formatters', () => {
	describe('Testing getFullPath', () => {
		test('should append the path to the url', () => {
			expect(getFullPath(mockRequest({ host: 'localhost:3000', protocol: 'http' }), '/test/here')).toBe(
				'http://localhost:3000/test/here'
			);
		});

		test('should allow override of protocol', () => {
			expect(
				getFullPath(mockRequest({ host: 'localhost:3000', protocol: 'http' }), '/test/here', {
					protocol: 'https',
				})
			).toBe('https://localhost:3000/test/here');
		});
	});

	describe('Testing normalizePath', () => {
		test('should strip prefix', () => {
			expect(normalizePath('/auth/login', 'auth')).toBe('/login');
		});

		test('should remove trailing slash', () => {
			expect(normalizePath('/auth/login/', 'auth')).toBe('/login');
		});
	});
});
