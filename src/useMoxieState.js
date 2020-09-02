import { is } from '@itsjonq/is';

import { useMoxie } from './useMoxie';
import { useMoxieStateDefaultProps, warning } from './utils';

const defaultProps = useMoxieStateDefaultProps;

export function useMoxieState(props = defaultProps) {
	let mergedProps = defaultProps;

	if (!is.plainObject(props)) {
		warning(
			true,
			'Props are invalid. Please provide props in a plain object.',
		);
	} else {
		mergedProps = { ...defaultProps, ...props };
	}

	// Convert from state object to array (Array<object>) for useMoxie
	mergedProps.initialState = [{ ...mergedProps.initialState, id: 'state' }];

	const { actions, data, ...moxieProps } = useMoxie(mergedProps);
	const [_state] = data;

	const {
		// Omitting Moxie props from the state
		createdAt,
		id,
		updatedAt,
		...state
	} = _state || {};

	const setState = (next) => actions.put({ ...next, id: 'state' });
	const removeState = () => actions.remove('state');

	return {
		...moxieProps,
		removeState,
		setState,
		state,
	};
}
