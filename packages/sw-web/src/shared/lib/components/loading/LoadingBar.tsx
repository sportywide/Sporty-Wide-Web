import React, { useContext, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';
import ReactLoadingBar, { hideLoading, showLoading } from 'react-redux-loading-bar';
import { ContainerInstance } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';

const LoadingBarComponent: React.FC<any> = () => {
	const { store } = useContext(ReactReduxContext);
	const container: ContainerInstance = store.container;
	const apiService = container.get(ApiService);

	useEffect(() => {
		let lastNumApiCalls = 0;
		apiService.subscribeToApiCalls().subscribe(numApiCalls => {
			if (numApiCalls > 0 && !lastNumApiCalls) {
				store.dispatch(showLoading());
			} else if (!numApiCalls) {
				store.dispatch(hideLoading());
			}

			lastNumApiCalls = numApiCalls;
		});
	}, [apiService, store]);
	return (
		<header>
			<ReactLoadingBar />
		</header>
	);
};

export const LoadingBar = LoadingBarComponent;
