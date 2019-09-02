import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface IProps {
	styleTags: string;
}

export default class extends Document<IProps> {
	static getInitialProps({ renderPage }) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet();

		// Step 2: Retrieve styles from components in the page
		const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement();

		// Step 4: Pass styleTags as a prop
		return { ...page, styleTags };
	}

	render() {
		return (
			<html>
				<Head>
					<meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
					{this.props.styleTags}
					<link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
