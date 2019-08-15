import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { Flag, Segment, Button } from 'semantic-ui-react';
import { CharacterInfo } from '@web/features/home/components';
import { fetchCharacter } from '@web/features/home/services/character.service';
import { startFetchingCharacters, stopFetchingCharacters } from '@web/features/home/store/actions';
import { compose } from 'recompose';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { reducer as homeReducer } from '@web/features/home/store/reducers';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchUserEpic } from '@web/features/home/store/epics';

interface IProps {
	startFetchingCharacters: Function;
	stopFetchingCharacters: Function;
}

class Counter extends React.Component<IProps, any> {
	static async getInitialProps({ store, isServer }) {
		const resultAction = await fetchCharacter(1, isServer).toPromise(); // we need to convert observable to Promise
		store.dispatch(resultAction);

		return { isServer };
	}

	componentDidMount() {
		this.props.startFetchingCharacters();
	}

	componentWillUnmount() {
		this.props.stopFetchingCharacters();
	}

	render() {
		return (
			<div>
				<h1>Index Page</h1>
				<CharacterInfo />
				<Segment>
					<Flag name="ae" />
					<Flag name="france" />
					<Flag name="myanmar" />
					<Button primary>Test semantic</Button>
				</Segment>
				<br />
				<nav>
					<Link href="/other">
						<a>Navigates to &quot;/other&quot;</a>
					</Link>
				</nav>
			</div>
		);
	}
}

const enhance = compose(
	registerReducer({ home: homeReducer }),
	registerEpic(fetchUserEpic),
	connect(
		null,
		{
			startFetchingCharacters,
			stopFetchingCharacters,
		}
	)
);

export default enhance(Counter);
