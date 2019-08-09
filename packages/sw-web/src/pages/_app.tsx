import 'reflect-metadata';
import App, { Container } from 'next/app';
import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from '@web/shared/lib/store';

interface IProps {
	store: Store;
}

class SportyWideApp extends App<IProps> {
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};

		if (Component.registerEpics) {
			Component.registerEpics(ctx.store.epicManager);
		}

		if (Component.registerReducers) {
			Component.registerReducers(ctx.store.reducerManager);
		}

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps };
	}

	render() {
		const { Component, pageProps, store } = this.props;
		return (
			<Container>
				<Provider store={store}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		);
	}
}

export default withRedux(initStore)(SportyWideApp);
