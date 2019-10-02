import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { keyBy } from 'lodash';

export function usePrevious<T>(value) {
	const ref = useRef<T>();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
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
