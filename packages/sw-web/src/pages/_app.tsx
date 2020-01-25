import 'sporty-wide-style/dist/semantic.min.css';
import '@web/styles/styles.scss';
import 'reflect-metadata';
import { ApolloProvider } from '@apollo/react-common';
import App from 'next/app';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import withRedux from 'next-store-wrapper';
import { ContainerContext, getUser, initStore, ISportyWideStore } from '@web/shared/lib/store';
import { redirect } from '@web/shared/lib/navigation/helper';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { allowActiveOnly } from '@web/shared/lib/auth/check-user';
import { ThemeProvider } from 'styled-components';
import { COOKIE_REFERRER } from '@web/api/auth/constants';
import Notifications from 'react-notification-system-redux';
import NotificationContainer from '@web/shared/lib/ui/components/notification/NotificationContainer';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { LoadingBar } from '@web/shared/lib/ui/components/loading/LoadingBar';
import { ApiService } from '@web/shared/lib/http/api.service';
import EventModalManager from '@web/shared/lib/popup/EventModalManager';
import ConfirmationManager from '@web/shared/lib/popup/ConfirmationManager';
import { bugsnagClient } from '@web/shared/lib/bugsnag';
import { SwSideBar } from '@web/shared/lib/ui/components/sidebar/Sidebar';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';
import { WINDOW_CLICK } from '@web/shared/lib/popup/event.constants';
import { Context as ResponsiveContext } from 'react-responsive';
import { getDeviceWidth } from '@web/styles/constants/size';

const ErrorBoundary = bugsnagClient.getPlugin('react');

interface IProps {
	store: ISportyWideStore;
	user: IUser;
	deviceWidth: number;
	flashMessages: {};
}

const theme = {
	colors: {
		primary: '#0288D1',
		accent: '#FF5722',
		grey: '#e9ebee',
		white: '#fff',
		transparent: 'rgba(0, 0, 0, 0)',
		black: '#000',
	},
	dimen: {
		navBar: '47px',
	},
};

class SwApp extends App<IProps> {
	listeners: Function[] = [];
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

		if (user) {
			bugsnagClient.user = user;
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
		let deviceWidth;
		if (ctx.req) {
			flashMessages = ctx.req.flash() || {};
			deviceWidth = getDeviceWidth(ctx.req.headers['user-agent']);
		}

		return { pageProps, user, flashMessages, deviceWidth };
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
		this.registerListeners();
	}

	registerClickListeners() {
		const eventHandler = e => {
			const eventDispatcher = this.props.store.container.get(EventDispatcher);
			eventDispatcher.trigger(WINDOW_CLICK, e);
		};
		window.addEventListener('click', eventHandler);

		this.listeners.push(() => {
			window.removeEventListener('click', eventHandler);
		});
	}

	registerListeners() {
		this.registerClickListeners();
	}

	componentWillUnmount(): void {
		this.listeners.forEach(listener => listener());
	}

	render() {
		const { Component, pageProps, store, user, deviceWidth } = this.props;
		const container = store.container;
		const apiService = container.get(ApiService);
		const ResponsiveWrapper = deviceWidth
			? ({ children }) => (
					<ResponsiveContext.Provider value={{ width: deviceWidth }}>{children}</ResponsiveContext.Provider>
			  )
			: React.Fragment;
		return (
			<ErrorBoundary>
				<ResponsiveWrapper>
					<ThemeProvider theme={theme}>
						<StoreProvider store={store}>
							<ApolloProvider client={apiService.graphql()}>
								<ContainerContext.Provider value={store.container}>
									<LoadingBar />
									{user && user.status === UserStatus.ACTIVE ? (
										<SwSideBar>
											<Component {...pageProps} />
										</SwSideBar>
									) : (
										<Component {...pageProps} />
									)}
									<NotificationContainer />
									<ConfirmationManager />
									<EventModalManager />
									<div id={'loading-portal'} />
								</ContainerContext.Provider>
							</ApolloProvider>
						</StoreProvider>
					</ThemeProvider>
				</ResponsiveWrapper>
			</ErrorBoundary>
		);
	}
}

function validateUser(context: any, Component) {
	const store = context.store;

	const user = getUser(store);
	const checkUser = Component.checkUser || allowActiveOnly;
	const allowUser = checkUser(user);

	return { allowUser, user };
}

export default withRedux(initStore)(SwApp);
