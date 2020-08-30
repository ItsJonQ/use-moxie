import tinyWarning from 'tiny-warning';

export const TYPES = {
	DELETE_FAILED: 'DELETE_FAILED',
	DELETE_STARTED: 'DELETE_STARTED',
	DELETE_SUCCESS: 'DELETE_SUCCESS',

	GET_FAILED: 'GET_FAILED',
	GET_STARTED: 'GET_STARTED',
	GET_SUCCESS: 'GET_SUCCESS',

	POST_FAILED: 'POST_FAILED',
	POST_STARTED: 'POST_STARTED',
	POST_SUCCESS: 'POST_SUCCESS',

	PUT_FAILED: 'PUT_FAILED',
	PUT_STARTED: 'PUT_STARTED',
	PUT_SUCCESS: 'PUT_SUCCESS',
};

export function warning(assert, ...args) {
	return tinyWarning(!assert, ['use-moxie', ...args].join('\n'));
}
