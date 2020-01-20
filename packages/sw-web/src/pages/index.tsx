import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { logout } from '@web/features/auth/store/actions';
import { allowActiveOnly, checkUser } from '@web/shared/lib/auth/check-user';

class SwIndex extends React.Component<any, any> {
	constructor(props: Readonly<any>) {
		super(props);
		this.state = { activeItem: 'home', sidebarVisible: false };
	}

	render() {
		return null;
	}
}

const enhance = compose(
	checkUser(allowActiveOnly),
	connect(state => ({ user: state.auth.user }), {
		logout,
	})
);

export default enhance(SwIndex);
