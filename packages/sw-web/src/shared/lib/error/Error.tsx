import { SwIcon } from '@web/shared/lib/icon';
import React from 'react';

export function ErrorMessage({ message }) {
	return (
		<div className={'sw-center sw-flex-justify-center sw-flex sw-flex-grow sw-flex-column sw-flex-center'}>
			<SwIcon name={'sad'} width={150} height={150} />
			<div className={'sw-mt2'}>{message}</div>
		</div>
	);
}
