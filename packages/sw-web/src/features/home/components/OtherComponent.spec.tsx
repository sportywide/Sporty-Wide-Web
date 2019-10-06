import { render } from '@testing-library/react';

import React from 'react';
import { SwOther } from './OtherComponent';

test('shows the children when the checkbox is checked', () => {
	const { getByText } = render(<SwOther />);

	expect((getByText('Other Page') as any).tagName).toBe('H1');
});
