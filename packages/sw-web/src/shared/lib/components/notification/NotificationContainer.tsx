import React, { useContext, useEffect } from 'react';
import Notifications, { error, warning } from 'react-notification-system-redux';
import { connect, ReactReduxContext } from 'react-redux';
import { ApiService } from '@web/shared/lib/http/api.service';
import { Container } from 'typedi';
import { UNAUTHENTICATED } from '@web/shared/lib/http/status-codes';
import { safeGet } from '@shared/lib/utils/object/get';

interface IProps {
	notifications: any[];
}

const NotificationContainer: React.FC<IProps> = function({ notifications }) {
	const { store } = useContext(ReactReduxContext);
	const container: typeof Container = store.container;
	const apiService = container.get(ApiService);

	useEffect(() => {
		apiService.subscribeToError().subscribe((e: any) => {
			const status = e.response && e.response.status;
			let title, message, notificationFunc;
			if (status >= 500) {
				title = 'Oops! Something went wrong';
				message = 'Please try again later';
				notificationFunc = error;
			} else if (status >= 400 && status !== UNAUTHENTICATED) {
				title = 'Nope';
				message = safeGet(() => e.response.data.message) || 'Error';
				notificationFunc = warning;
			}
			if (notificationFunc) {
				store.dispatch(
					notificationFunc({
						title,
						message,
					})
				);
			}
		});
	}, [apiService, store]);
	return <Notifications notifications={notifications} />;
};

export default connect(({ notifications }) => ({ notifications }))(NotificationContainer);
