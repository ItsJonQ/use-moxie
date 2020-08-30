import React from 'react';

import { useMoxie } from '../useMoxie';

export default {
	title: 'Example/useMoxie',
};

const Example = () => {
	const {
		actions,
		data,
		didInitialFetch,
		isPending,
		loading,
		pending,
	} = useMoxie({});

	if (!didInitialFetch && loading) {
		return <div>...</div>;
	}

	console.log(pending);
	return (
		<div>
			<button onClick={() => actions.post({ message: 'hello' })}>
				Add New
			</button>
			<button disabled={pending.length} onClick={() => actions.remove()}>
				Remove All
			</button>
			{data.map((entry) => (
				<div key={entry.id}>
					{entry.message}
					<br />
					<button
						disabled={isPending(entry)}
						onClick={() =>
							actions.put({ ...entry, message: Date.now() })
						}
					>
						Update
					</button>
					<button
						disabled={isPending(entry)}
						onClick={() => actions.remove(entry.id)}
					>
						Remove
					</button>
				</div>
			))}
		</div>
	);
};

export const _default = Example.bind({});
