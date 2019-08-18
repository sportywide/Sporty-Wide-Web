import OtherPage from '@web/pages/other';
import { render } from '@testing-library/react';
import '@web-test/test-setup';

import React from 'react';

test('shows the children when the checkbox is checked', () => {
	const { getByText } = render(<OtherPage />);

	expect((getByText('Other Page') as any).tagName).toBe('H1');
});
