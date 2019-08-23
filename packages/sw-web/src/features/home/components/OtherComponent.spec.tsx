import { render } from '@testing-library/react';
import '@web-test/test-setup';

import React from 'react';
import { Other } from './OtherComponent';

test('shows the children when the checkbox is checked', () => {
	const { getByText } = render(<Other />);

	expect((getByText('Other Page') as any).tagName).toBe('H1');
});
