import { is } from '@itsjonq/is';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { TYPES, warning } from './utils';

const defaultProps = {
	actionReducer: (...args) => args,
	collection: 'temp',
	username: '@use-moxie-hook-default',
};

export function useMoxie(props = defaultProps) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	let mergedProps = defaultProps;
	if (!is.plainObject(props)) {
		warning(
			true,
			'Props are invalid. Please provide props in a plain object.',
		);
	} else {
		mergedProps = { ...defaultProps, ...props };
	}

	const { actionReducer, collection, username } = mergedProps;

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
			try {
				report(TYPES.GET_STARTED);

				const getCollection = !entry || !is.string(entry);

				let url = getCollection
					? `/${collection}`
					: `/${collection}/${entry}`;
				const response = await api.get(url);

				report(TYPES.GET_SUCCESS, response);

				if (getCollection) {
					setData(response.data);
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
		[api, collection, report],
	);

	const post = useCallback(
		async (entry) => {
			if (!is.plainObject(entry)) {
				warning(true, 'Entry must be a plain object');
				return;
			}

			setLoading(true);

			try {
				report(TYPES.POST_STARTED);

				const response = await api.post(`/${collection}`, entry);
				report(TYPES.POST_SUCCESS, response);

				setData((prev) => [...prev, response.data.data]);

				didInitialFetchRef.current = true;
			} catch (err) {
				report(TYPES.POST_FAILED, err);

				warning(
					true,
					'Could not post data.',
					'Ensure entry values are correct.',
				);
			}

			setLoading(false);
		},
		[api, collection, report],
	);

	const put = useCallback(
		async (entry) => {
			if (!is.plainObject(entry)) {
				warning(true, 'Entry must be a plain object.');
				return;
			}

			setLoading(true);

			try {
				const { id } = entry;

				report(TYPES.PUT_STARTED);

				const response = await api.put(
					`/${collection}/${id}`,
					JSON.stringify(entry),
				);
				report(TYPES.PUT_SUCCESS, response);

				setData((prev) =>
					prev.map((item) => {
						if (item.id === id) {
							return { ...item, ...entry };
						}
						return item;
					}),
				);
			} catch (err) {
				report(TYPES.PUT_FAILED, err);

				warning(
					true,
					'Could not update data',
					'Ensure entry values are correct.',
				);
			}

			setLoading(false);
		},
		[api, collection, report],
	);

	const patch = put;

	const remove = useCallback(
		async (entry) => {
			setLoading(true);

			try {
				report(TYPES.DELETE_STARTED);

				const removeCollection = !entry || !is.string(entry);

				let url = removeCollection
					? `/${collection}`
					: `/${collection}/${entry}`;
				const response = await api.delete(url);

				report(TYPES.DELETE_SUCCESS, response);

				if (removeCollection) {
					setData([]);
				} else {
					setData((prev) => prev.filter((item) => item.id !== entry));
				}
			} catch (err) {
				report(TYPES.DELETE_FAILED, err);

				warning(true, 'Could not delete data.');
			}

			setLoading(false);
		},
		[api, collection, report],
	);

	useEffect(() => {
		if (!didInitialFetchRef.current) {
			get();
			didInitialFetchRef.current = true;
		}
	}, [get]);

	const hasData = !!data.length;
	const didInitialFetch = didInitialFetchRef.current;
	const actions = {
		get,
		patch,
		post,
		put,
		remove,
	};

	return {
		actions,
		data,
		didInitialFetch,
		hasData,
		loading,
	};
}
