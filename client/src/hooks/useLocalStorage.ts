import { useState, useEffect, Dispatch, SetStateAction } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		try {
			if (typeof window !== "undefined") {
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			} else {
				return initialValue;
			}
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (error) {
			console.error(error);
		}
	}, [key, value]);

	return [value, setValue];
}

export default useLocalStorage;
