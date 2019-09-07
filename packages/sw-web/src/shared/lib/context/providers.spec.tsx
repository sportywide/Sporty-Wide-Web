import * as React from 'react';
import { withContext } from '@web/shared/lib/context/providers';
import { render } from '@testing-library/react';

const CONTEXT_VALUE = 10;

describe('Testing withContext', () => {
	test('Should add context as a prop', done => {
		const MyComponent = function(props) {
			expect(props.context).toBe(CONTEXT_VALUE);
			done();
			return <div />;
		};
		const context = React.createContext(CONTEXT_VALUE);
		const ContextComponent = withContext(context)(MyComponent);
		render(<ContextComponent />);
	});
});
