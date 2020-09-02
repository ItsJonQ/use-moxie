import { is } from '@itsjonq/is';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useLocalState } from './useLocalState';
import { useOnline } from './useOnline';
import { TYPES, useMoxieDefaultProps, warning } from './utils';

const defaultProps = useMoxieDefaultProps;

export function useMoxie(props = defaultProps) {
	let mergedProps = defaultProps;
	if (!is.plainObject(props)) {
		warning(
			true,
			'Props are invalid. Please provide props in a plain object.',
		);
	} else {
		mergedProps = { ...defaultProps, ...props };
	}

	const { actionReducer, collection, initialState, username } = mergedProps;

	const localStorageKey = `useMoxie/${username}/${collection}`;
	const localStorageDeleteKey = `useMoxie/${username}/${collection}/DELETE`;

	const isOnline = useOnline();
	const isOnlineRef = useRef(isOnline);
	const didSaveLocalState = useRef(false);
	const didSyncInitialState = useRef(false);

	const [loading, setLoading] = useState(true);
	const [localState, setLocalState] = useLocalState(
		localStorageKey,
		initialState,
	);
	const [localDeleteState, setLocalDeleteState] = useLocalState(
		localStorageDeleteKey,
		[],
	);
	const [pending, setPending] = useState([]);
	const [data, setData] = useState(localState || []);

	const baseURL = useRef(`https://usemoxie.xyz/api/${username}`).current;
	const api = useRef(
		axios.create({
			baseURL,
		}),
	).current;

	const didInitialFetchRef = useRef(false);

	const report = useCallback(
		(...args) => {
			if (is.function(actionReducer)) {
				actionReducer(...args);
			}
		},
		[actionReducer],
	);

	const get = useCallback(
		async (entry) => {
			setLoading(true);

			if (!isOnline) {
				report(TYPES.GET_OFFLINE, { message: 'Currently offline' });
				setLoading(false);
				return;
			}

			try {
				report(TYPES.GET_STARTED);

				const getCollection = !entry || !is.string(entry);

				let url = getCollection
					? `/${collection}`
					: `/${collection}/${entry}`;
				const response = await api.get(url);

				report(TYPES.GET_SUCCESS, response);

				if (getCollection) {
					setData((prev) => [...prev, ...response.data]);
				} else {
					setData((prev) =>
						prev.map((entry) => {
							if (entry.id === response.data.data.id) {
								return response.data.data;
							}
							return entry;
						}),
					);
				}
			} catch (err) {
				report(TYPES.GET_FAILED, err);

				warning(
					true,
					'Could not retrieve data',
					'Ensure username and collection values are correct',
					'See: https://usemoxie.xyz/',
				);
			}
			setLoading(false);
		},
		[api, collection, isOnline, report],
	);

	const postOperation = useCallback(
		async (data) => {
			try {
				report(TYPES.POST_STARTED);

				const response = await api.post(`/${collection}`, data);

				report(TYPES.POST_SUCCESS, response);
			} catch (err) {
				report(TYPES.POST_FAILED, err);

				setData((prev) =>
					prev.filter((item) => {
						const match = data.find((i) => i.id === item.id);
						return !match;
					}),
				);

				warning(
					true,
					'Could not post data.',
					'Ensure entry values are correct.',
				);
			}
		},
		[api, collection, report],
	);

	const post = useCallback(
		async (entry) => {
			const isMultipleEntries = is.array(entry);

			if (!is.plainObject(entry) && !isMultipleEntries) {
				warning(true, 'Entry must be a plain object or array');
				return;
			}

			setLoading(true);

			let data = isMultipleEntries ? entry : [entry];

			data = data.map((item) => {
				const postId = item?.id || uuid();

				return {
					createdAt: Date.now(),
					id: postId,
					...item,
				};
			});

			setData((prev) => [...prev, ...data]);
			setPending((prev) => [...prev, ...data.map((item) => item.id)]);

			if (!isOnline) {
				report(TYPES.POST_OFFLINE, { message: 'Currently offline' });

				setLocalState((prev) => [...prev, ...data]);
			} else {
				await postOperation(data);
			}

			setPending([]);
			setLoading(false);
		},
		[isOnline, postOperation, report, setLocalState],
	);

	const putOperation = useCallback(
		async (data, previousData) => {
			try {
				report(TYPES.PUT_STARTED);

				const response = await api.put(`/${collection}`, data);

				report(TYPES.PUT_SUCCESS, response);
			} catch (err) {
				report(TYPES.PUT_FAILED, err);

				if (previousData) {
					setData((prev) =>
						prev.map((item) => {
							const match = previousData.find(
								(i) => i.id === item.id,
							);
							return match || item;
						}),
					);
				}

				warning(
					true,
					'Could not update data',
					'Ensure entry values are correct.',
				);
			}
		},
		[api, collection, report],
	);

	const put = useCallback(
		async (entry) => {
			const isMultipleEntries = is.array(entry);

			if (!is.plainObject(entry) && !isMultipleEntries) {
				warning(true, 'Entry must be a plain object or array');
				return;
			}

			setLoading(true);

			let data = isMultipleEntries ? entry : [entry];

			data = data.map((entry) => ({ ...entry, updatedAt: Date.now() }));
			let previousData;

			setData((prev) => {
				previousData = prev;
				return prev.map((item) => {
					const match = data.find((i) => i.id === item.id);
					if (match) {
						return { ...item, ...match, updatedAt: Date.now() };
					}
					return item;
				});
			});
			setPending((prev) => [...prev, ...data.map((item) => item.id)]);

			if (!isOnline) {
				report(TYPES.PUT_OFFLINE, { message: 'Currently offline' });

				setLocalState((prev) =>
					prev.map((item) => {
						const match = data.find((i) => i.id === item.id);
						if (match) {
							return { ...item, ...match, updatedAt: Date.now() };
						}
						return item;
					}),
				);
			} else {
				await putOperation(data, previousData);
			}

			setPending([]);
			setLoading(false);
		},
		[isOnline, putOperation, report, setLocalState],
	);

	const patch = put;

	const removeOperation = useCallback(
		async (data, previousData, url) => {
			try {
				report(TYPES.DELETE_STARTED);

				const response = await api.delete(url, data);

				report(TYPES.DELETE_SUCCESS, response);
			} catch (err) {
				report(TYPES.DELETE_FAILED, err);

				if (previousData) {
					setData(() => previousData);
				}

				warning(true, 'Could not delete data.');
			}
		},
		[api, report],
	);

	const remove = useCallback(
		async (entry) => {
			setLoading(true);

			const removeCollection = !entry;
			const isMultipleEntries = is.array(entry);

			let data = isMultipleEntries
				? entry
				: is.string(entry)
				? [{ id: entry }]
				: [entry];

			let previousData;

			setData((prev) => {
				previousData = prev;
				if (removeCollection) {
					return prev.filter((item) => !item);
				} else {
					return prev.filter((item) => {
						const match = data.find((i) => i.id === item.id);
						return !match;
					});
				}
			});
			if (!removeCollection) {
				setPending((prev) => [...prev, ...data.map((item) => item.id)]);
			}

			if (!isOnline) {
				report(TYPES.DELETE_OFFLINE, { message: 'Currently offline' });

				if (removeCollection) {
					setLocalState((prev) => prev.filter((item) => !item));
				} else {
					setLocalState((prev) =>
						prev.filter((item) => {
							const match = data.find((i) => i.id === item.id);
							return !match;
						}),
					);
					setLocalDeleteState((prev) => [...prev, ...data]);
				}

				setLoading(false);
				return;
			} else {
				const url =
					removeCollection || isMultipleEntries
						? `/${collection}`
						: `/${collection}/${entry}`;
				await removeOperation(data, previousData, url);
			}

			setPending([]);
			setLoading(false);
		},
		[
			collection,
			isOnline,
			removeOperation,
			report,
			setLocalDeleteState,
			setLocalState,
		],
	);

	const synchronizeLocalState = useCallback(async () => {
		if (!isOnline) return;

		if (localState.length) {
			const entriesToPost = [];
			const entriesToPut = [];

			for (const entry of localState) {
				if (!entry.updatedAt) {
					entriesToPost.push(entry);
				} else {
					entriesToPut.push(entry);
				}
			}

			if (entriesToPost.length) {
				await postOperation(entriesToPost);
			}
			if (entriesToPut.length) {
				await putOperation(entriesToPut);
			}
			setLocalState([]);
		}

		if (localDeleteState.length) {
			await remove(localDeleteState);
			setLocalDeleteState([]);
		}
	}, [
		isOnline,
		localDeleteState,
		localState,
		postOperation,
		putOperation,
		remove,
		setLocalDeleteState,
		setLocalState,
	]);

	const synchronizeInitialState = useCallback(async () => {
		if (!isOnline) return;

		if (!didSyncInitialState.current) {
			if (is.array(initialState)) {
				await postOperation(initialState);
			}

			didSyncInitialState.current = true;
		}
	}, [initialState, isOnline, postOperation]);

	const synchronize = useCallback(async () => {
		synchronizeInitialState();
		await synchronizeLocalState();
	}, [synchronizeInitialState, synchronizeLocalState]);

	useEffect(() => {
		const load = async () => {
			try {
				await synchronize();
				get();
			} catch (err) {
				console.warn('Could not synchronize data.', err);
			}
		};

		if (!didInitialFetchRef.current) {
			load();
			didInitialFetchRef.current = true;
		}
	}, [get, synchronize]);

	useEffect(() => {
		if (isOnline) {
			report(TYPES.DETECT_ONLINE);
		} else {
			report(TYPES.DETECT_OFFLINE);
		}
	}, [isOnline, report]);

	useEffect(() => {
		if (isOnline !== isOnlineRef.current && !didSaveLocalState.current) {
			setLocalState(data);
			didSaveLocalState.current = true;
		}
	}, [data, isOnline, setLocalState]);

	const hasData = !!data.length;
	const didInitialFetch = didInitialFetchRef.current;
	const actions = {
		get,
		patch,
		post,
		put,
		remove,
	};

	const isPending = (entry) => {
		const match = is.plainObject(entry) ? entry?.id : entry;
		return pending.includes(match);
	};

	return {
		actions,
		data,
		didInitialFetch,
		hasData,
		isPending,
		loading,
		pending,
	};
}
