import 'sporty-wide-style/dist/semantic.min.css';
import 'sporty-wide-style/dist/basscss.min.css';
import '@web/styles/styles.scss';
import 'reflect-metadata';
import App, { Container } from 'next/app';
import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-store-wrapper';
import { initStore, ISportyWideStore, UserContext } from '@web/shared/lib/store';
import { redirect } from '@web/shared/lib/navigation/helper';
import { IUser } from '@web/shared/lib/interfaces/auth/user';

interface IProps {
	store?: Store;
	user?: IUser;
}

class SportyWideApp extends App<IProps> {
	static async getInitialProps({ Component, ctx }) {
		const store: ISportyWideStore = ctx.store;
		const container = store.container;
		const user: IUser = container.get('currentUser');
		let pageProps = {};

		if (!Component.allowUnauthenticated && !user) {
			await redirect({ context: ctx, route: 'login' });
			return { pageProps };
		}

		if (Component.registerEpics) {
			Component.registerEpics(store.epicManager);
		}

		if (Component.registerReducers) {
			Component.registerReducers(store.reducerManager);
		}

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps, user };
	}

	render() {
		const { Component, pageProps, store, user } = this.props;
		return (
			<Container>
				<Provider store={store}>
					<UserContext.Provider value={user}>
						<Component {...pageProps} />
					</UserContext.Provider>
				</Provider>
			</Container>
		);
	}
}

export default withRedux(initStore)(SportyWideApp);
