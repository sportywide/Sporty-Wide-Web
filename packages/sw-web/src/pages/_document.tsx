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
					{this.props.styleTags}
					<link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
					<link rel="stylesheet" type="text/css" href="/static/basscss.min.css" />
					<link rel="stylesheet" type="text/css" href="/static/semantic.min.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
