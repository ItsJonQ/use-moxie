import React from 'react';

import { useMoxie } from '../useMoxie';

export default {
	title: 'Example/useMoxie',
};

const Example = () => {
	const { actions, data, didInitialFetch, loading } = useMoxie({
		actionReducer: (data, other) => console.log(data, other),
	});

	if (!didInitialFetch && loading) {
		return <div>...</div>;
	}

	return (
		<div>
			<button onClick={() => actions.post({ message: 'hello' })}>
				Add New
			</button>
			<button onClick={() => actions.remove()}>Remove All</button>
			{data.map((entry) => (
				<div key={entry.id}>
					{entry.message}
					<br />
					<button
						onClick={() =>
							actions.put({ ...entry, message: Date.now() })
						}
					>
						Update
					</button>
					<button onClick={() => actions.remove(entry.id)}>
						Remove
					</button>
				</div>
			))}
		</div>
	);
};

export const _default = Example.bind({});
