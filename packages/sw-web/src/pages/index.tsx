import React from 'react';
import Link from 'next/link';
import { CharacterInfo } from '@web/features/home/components';

interface Props {
	startFetchingCharacters: Function;
	stopFetchingCharacters: Function;
}

class Counter extends React.Component<Props, any> {
	render() {
		return (
			<div>
				<h1>Index Page</h1>
				<CharacterInfo />
				<br />
				<nav>
					<Link href="/other">
						<a>Navigate to &quot;/other&quot;</a>
					</Link>
				</nav>
			</div>
		);
	}
}

export default Counter;
