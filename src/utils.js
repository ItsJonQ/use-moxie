import tinyWarning from 'tiny-warning';

export const useMoxieDefaultProps = {
	actionReducer: (...args) => args,
	collection: 'temp',
	initialState: [],
	username: '@use-moxie-hook-default',
};

export const useMoxieStateDefaultProps = {
	...useMoxieDefaultProps,
	collection: 'temp-state',
};

export const TYPES = {
	DELETE_FAILED: 'DELETE_FAILED',
	DELETE_OFFLINE: 'DELETE_OFFLINE',
	DELETE_STARTED: 'DELETE_STARTED',
	DELETE_SUCCESS: 'DELETE_SUCCESS',

	DETECT_OFFLINE: 'DETECT_OFFLINE',
	DETECT_ONLINE: 'DETECT_ONLINE',

	GET_FAILED: 'GET_FAILED',
	GET_OFFLINE: 'GET_OFFLINE',
	GET_STARTED: 'GET_STARTED',
	GET_SUCCESS: 'GET_SUCCESS',

	POST_FAILED: 'POST_FAILED',
	POST_OFFLINE: 'POST_OFFLINE',
	POST_STARTED: 'POST_STARTED',
	POST_SUCCESS: 'POST_SUCCESS',

	PUT_FAILED: 'PUT_FAILED',
	PUT_OFFLINE: 'PUT_OFFLINE',
	PUT_STARTED: 'PUT_STARTED',
	PUT_SUCCESS: 'PUT_SUCCESS',
};

export function warning(assert, ...args) {
	return tinyWarning(!assert, ['use-moxie', ...args].join('\n'));
}
