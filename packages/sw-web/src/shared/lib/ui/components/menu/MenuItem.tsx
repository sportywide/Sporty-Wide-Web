import React, { ReactNode, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Router } from 'next/router';
import { findPathForRoute, withRouter } from '@web/routes';
import { IRouteOptions, redirect } from '@web/shared/lib/navigation/helper';
import { noop } from '@shared/lib/utils/functions';
import { match as pathMatch } from 'path-to-regexp';
import { SIDEBAR_CLOSED } from '@web/shared/lib/popup/event.constants';
import { ContainerContext } from '@web/shared/lib/store';
import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';

interface IProps {
	name?: string;
	as?: string;
	className?: string;
	router: Router;
	showActive?: boolean;
	route?: string;
	routeParams?: any;
	routeOptions?: IRouteOptions;
	onClick?: any;
	children?: ReactNode;
}

export const SwMenuItemComponent: React.FC<IProps> = function({
	name,
	as,
	className,
	router,
	onClick,
	routeOptions,
	showActive = true,
	route,
	routeParams,
	children,
}) {
	const container = useContext(ContainerContext);
	const eventDispatcher = container.get(EventDispatcher);
	return (
		<Menu.Item
			as={as}
			name={name}
			className={className}
			active={showActive && isActive(route)}
			onClick={() => (onClick || defaultClickHandler || noop)()}
		>
			{children}
		</Menu.Item>
	);

	function isActive(route) {
		if (!route) {
			return false;
		}
		const currentPath = router.asPath;
		const path = findPathForRoute(route);
		return !!pathMatch(path)(currentPath);
	}

	function defaultClickHandler() {
		if (!route) {
			return;
		}
		eventDispatcher.trigger(SIDEBAR_CLOSED);
		return redirect({
			route,
			params: routeParams,
			...routeOptions,
		});
	}
};

export const SwMenuItem = withRouter(SwMenuItemComponent);
