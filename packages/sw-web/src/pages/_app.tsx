import 'sporty-wide-style/dist/basscss.min.css';
import 'sporty-wide-style/dist/semantic.min.css';
import '@web/styles/styles.scss';
import 'reflect-metadata';
import App from 'next/app';
import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-store-wrapper';
import { initStore, ISportyWideStore, UserContext } from '@web/shared/lib/store';
import { redirect } from '@web/shared/lib/navigation/helper';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { allowActiveOnly } from '@web/shared/lib/auth/check-user';
import { ThemeProvider } from 'styled-components';
import { COOKIE_REFERRER } from '@web/api/auth/constants';
import Notifications from 'react-notification-system-redux';
import NotificationContainer from '@web/shared/lib/components/notification/NotificationContainer';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { LoadingBar } from '@web/shared/lib/components/loading/LoadingBar';

interface IProps {
	store: Store;
	user?: IUser;
	flashMessages: {};
}

const theme = {
	colors: {
		primary: '#4da88a',
		accent: '#ee4c50',
		grey: '#e9ebee',
		white: '#fff',
		transparent: 'rgba(0, 0, 0, 0)',
	},
};

class SwApp extends App<IProps> {
	static async getInitialProps({ Component, ctx }) {
		const store: ISportyWideStore = ctx.store;
		let pageProps = {};

		const { allowUser, user } = validateUser(ctx, Component);

		if (!allowUser) {
			if (!user && ctx.req) {
				ctx.res.cookie(COOKIE_REFERRER, ctx.req.url);
			}
			await redirect({
				context: ctx,
				route: Component.failureRedirect || 'login',
				replace: true,
			});
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

		let flashMessages = {};
		if (ctx.req) {
			flashMessages = ctx.req.flash() || {};
		}

		return { pageProps, user, flashMessages };
	}

	componentDidMount(): void {
		const flashMessages = this.props.flashMessages;
		for (const type of ['success', 'error', 'warning', 'info']) {
			if (flashMessages[type] && flashMessages[type].length) {
				for (const message of flashMessages[type]) {
					this.props.store.dispatch(
						Notifications[type]({
							title: ucfirst(type),
							message,
						})
					);
				}
			}
		}
	}

	render() {
		const { Component, pageProps, store, user } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<Provider store={store}>
					<UserContext.Provider value={user}>
						<LoadingBar />
						<Component {...pageProps} />
					</UserContext.Provider>
					<NotificationContainer />
				</Provider>
			</ThemeProvider>
		);
	}
}

function validateUser(context: any, Component) {
	const store = context.store;
	const container = store.container;
	const user: IUser = container.get('currentUser');

	const checkUser = Component.checkUser || allowActiveOnly;
	const allowUser = checkUser(user);

	return { allowUser, user };
}

export default withRedux(initStore)(SwApp);
