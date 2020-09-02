import React from 'react';

import { useMoxieState } from '../useMoxieState';

export default {
	title: 'Example/useMoxieState',
};

const Example = () => {
	const { didInitialFetch, loading, setState, state } = useMoxieState({
		initialState: {
			active: false,
		},
	});

	if (!didInitialFetch && loading) {
		return <div>...</div>;
	}

	return (
		<div>
			<button onClick={() => setState({ active: !state.active })}>
				Toggle
			</button>
			{state.active ? 'On' : 'Off'}
		</div>
	);
};

export const _default = Example.bind({});
