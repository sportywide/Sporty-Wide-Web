import { EffectCallback, MutableRefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { keyBy } from 'lodash';
import { useSelector } from 'react-redux';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { getEmptyImage } from 'react-dnd-html5-backend-cjs';
import { formationMap } from '@shared/lib/dtos/formation/formation.dto';
import { SwApp } from '@web/shared/lib/app';
import { ContainerContext } from '@web/shared/lib/store';

export function usePrevious<T>(value) {
	const ref = useRef<T>();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

export function useUser(): IUser {
	return useSelector(state => state.auth && state.auth.user);
}

export function useApp(): SwApp {
	const container = useContext(ContainerContext);
	return container.get(SwApp);
}

export function useFormationOptions() {
	return useMemo(() => {
		return Object.entries(formationMap).map(([key, formation]) => ({
			text: formation.name,
			value: key,
		}));
	}, []);
}

export function useLocation() {
	const [location, setLocation] = useState();
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onChange, onError);

			const watchId = navigator.geolocation.watchPosition(onChange, onError);

			return () => {
				navigator.geolocation.clearWatch(watchId);
			};
		}
	}, []);

	return location;

	function onChange(position) {
		setLocation(position);
	}
	function onError() {
		setLocation(null);
	}
}

export function useKeyMap<T>(array: T[] | undefined, key): { [key: string]: T } {
	const [valueMap, setValueMap] = useState(null);
	useEffect(() => {
		if (!array) {
			return;
		}
		setValueMap(keyBy(array, key));
	}, [array, key]);

	return valueMap;
}

export function useCurrentRef<T>(initialValue: T): [T, MutableRefObject<T>, Function, T] {
	const [value, setValue] = useState<T>(initialValue);
	const valueRef = useRef<T>(value);
	const previous = usePrevious<T>(value);
	const setValueCallback = useCallback(updater => {
		if (typeof updater === 'function') {
			valueRef.current = updater(valueRef.current);
		} else {
			valueRef.current = updater;
		}
		setValue(updater);
	}, []);
	return [value, valueRef, setValueCallback, previous];
}

export function useStateRef<T>(initialValue: T): [() => T, Function] {
	const [state, setState] = useState<T>(initialValue);
	const ref = useRef(state);
	ref.current = state;
	const getValue = useCallback(() => ref.current, []);
	return [getValue, setState];
}

export function useEmptyPreviewImage(preview) {
	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
		// eslint-disable-next-line
	}, []);
}

export function useEffectOnce(effect: EffectCallback) {
	useEffect(effect, []);
}
