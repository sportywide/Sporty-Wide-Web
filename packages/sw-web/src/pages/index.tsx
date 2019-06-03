import React from 'react';

class IndexPage extends React.Component {
	componentDidMount(): void {
		console.log('here');
		fetch('/api/hello')
			.then(res => res.text())
			.then(console.log);
	}

	render() {
		return <h1>eeee</h1>;
	}
}

export default IndexPage;
