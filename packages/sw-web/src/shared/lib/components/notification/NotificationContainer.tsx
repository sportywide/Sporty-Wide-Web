import React from 'react';
import Notifications from 'react-notification-system-redux';
import { connect } from 'react-redux';

interface IProps {
	notifications: any[];
}

const NotificationContainer: React.FC<IProps> = function({ notifications }) {
	return <Notifications notifications={notifications} />;
};

export default connect(({ notifications }) => ({ notifications }))(NotificationContainer);
