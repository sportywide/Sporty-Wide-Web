import { decodeBase64, encodeBase64 } from '@web/shared/lib/encode/encoding';
let isBrowser = true;
jest.mock('@web/shared/lib/environment', () => ({
	isBrowser: () => isBrowser,
}));

describe('Testing encoding functions', () => {
	describe('Browser environment', () => {
		beforeEach(() => {
			isBrowser = true;
		});
		it('browser #decodeBase64', () => {
			expect(decodeBase64('xJDhu5cgVHXhuqVuIE5ndXnhu4Vu')).toEqual('Đỗ Tuấn Nguyễn');
		});

		it('browser #encodeBase64', () => {
			expect(encodeBase64('Đỗ Tuấn Nguyễn')).toEqual('xJDhu5cgVHXhuqVuIE5ndXnhu4Vu');
		});
	});

	describe('Node environment', () => {
		beforeEach(() => {
			isBrowser = false;
		});
		it('browser #decodeBase64', () => {
			expect(decodeBase64('xJDhu5cgVHXhuqVuIE5ndXnhu4Vu')).toEqual('Đỗ Tuấn Nguyễn');
		});

		it('browser #encodeBase64', () => {
			expect(encodeBase64('Đỗ Tuấn Nguyễn')).toEqual('xJDhu5cgVHXhuqVuIE5ndXnhu4Vu');
		});
	});
});
