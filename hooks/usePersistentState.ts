'use client';
// hooks/usePersistentState.ts
import { useEffect, useState } from 'react';
import { storage, indexedDBStore, isBrowser } from '../utils/storage';

type StorageType = 'local' | 'session';

export function usePersistentState<T>(
	key: string,
	initialValue: T,
	type: StorageType
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = useState<T>(
		!isBrowser ? initialValue : storage.get(key, type) ?? initialValue
	);

	useEffect(() => {
		if (!isBrowser) return;
		if (storage.has(key, type)) return;
		setState(initialValue);
	}, [initialValue, isBrowser]);

	useEffect(() => {
		if (!isBrowser) return;
		if (storage.has(key, type)) return setState(storage.get(key, type)!);

		storage.set(key, state, type);
		indexedDBStore.set(key, state);
	}, [key, type]);

	return [
		state,
		(args: Parameters<typeof setState>[0]) => {
			const newState = typeof args === 'function' ? args(state) : args;

			storage.set(key, newState, type);
			indexedDBStore.set(key, newState);

			return setState(args);
		},
	];
}
