import { useRef, useEffect, useState } from 'react';

export function usePrevious(value) {
	const ref = useRef();

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

			navigator.geolocation.watchPosition(onChange, onError);
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
