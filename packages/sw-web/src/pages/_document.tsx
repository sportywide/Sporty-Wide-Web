import React from 'react';
import Document, { Main, NextScript } from 'next/document';

export default class extends Document {
	render() {
		return (
			<html lang={this.props.__NEXT_DATA__.props.pageProps.lang || 'en'}>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
