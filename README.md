# 🔗 use-moxie

[![npm version](https://badge.fury.io/js/use-moxie.svg)](https://badge.fury.io/js/use-moxie)

> React hooks that integrates with [Moxie](https://usemoxie.xyz/) - an online REST API for prototyping.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [API](#api)
    -   [useMoxie({ username, collection, initialState, actionReducer })](#usemoxie-username-collection-initialstate-actionreducer-)
    -   [useMoxieState({ username, collection, initialState, actionReducer })](#usemoxiestate-username-collection-initialstate-actionreducer-)
-   [Example](#example)
-   [Offline Support](#offline-support)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save use-moxie
```

## Usage

Use the `useMoxie` hook by passing along a `username` and `collection` as props:

```jsx
import React from 'react';
import { useMoxie } from 'use-moxie';

const Example = () => {
	const { data, didInitialFetch, loading } = useMoxie({
		username: '@itsjonq',
		collection: 'use-moxie-demo',
	});

	if (!didInitialFetch && loading) {
		return <div>...</div>;
	}

	return (
		<div>
			{data.map((entry) => (
				<div key={entry.id}>{entry.message}</div>
			))}
		</div>
	);
};
```

## API

### useMoxie({ username, collection, initialState, actionReducer })

Used to manage a collection (`Array`) of entries (`object`).

Note: Updates (from `actions`) from the `useMoxie` hook makes a network request to Moxie server. Avoid making rapid updates (e.g. update per keystroke).

##### `username`

Type: `string`

Your username for Moxie. It must start with an `@`. Example: `@itsjonq`.

##### `collection`

Type: `string`

The name of the collection for your data. If it doesn't exist under your Moxie username, Moxie will create it for you automatically when you add your first entry.

##### `initialState`

Type: `Array<object>`

A collection of data to set as initial state. This state will be synced with Moxie on initial load.

##### `actionReducer`

Type: `function`

A callback function that dispatches events when `useMoxie` performs API actions.

Example:

```jsx
const { actions, data, didInitialFetch, loading } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo',
	actionReducer: (type) => console.log(type),
});
```

| Action Type      | Description                                        |
| ---------------- | -------------------------------------------------- |
| `GET_FAILED`     | `get` request has failed.                          |
| `GET_STARTED`    | `get` request has started.                         |
| `GET_SUCCESS`    | `get` request has succeed.                         |
| `GET_OFFLINE`    | `get` request bypassed. Currently offline.         |
| `POST_FAILED`    | `post` request has failed.                         |
| `POST_STARTED`   | `post` request has started.                        |
| `POST_SUCCESS`   | `post` request has succeed.                        |
| `POST_OFFLINE`   | `post` request saved locally. Currently offline.   |
| `PUT_FAILED`     | `put` request has failed.                          |
| `PUT_STARTED`    | `put` request has started.                         |
| `PUT_SUCCESS`    | `put` request has succeed.                         |
| `PUT_OFFLINE`    | `put` request saved locally. Currently offline.    |
| `DELETE_FAILED`  | `delete` request has failed.                       |
| `DELETE_STARTED` | `delete` request has started.                      |
| `DELETE_SUCCESS` | `delete` request has succeed.                      |
| `DELETE_OFFLINE` | `delete` request saved locally. Currently offline. |
| `DETECT_ONLINE`  | Detected internet connection is available.         |
| `DETECT_OFFLINE` | Detected internet connection is lost.              |

#### Props

The `useMoxie` hook provides a handful of useful props:

```jsx
const {
	actions,
	data,
	didInitialFetch,
	hasData,
	isPending,
	pending,
	loading,
} = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo',
});
```

##### `actions`

Type: `object`

Actions contains a collection of RESTful actions you can perform on your Moxie collection:

| Method                | Description                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `actions.get(id?)`    | Fetches your collection. Can fetch an individual entry if an `id` (`string`) is provided.  |
| `actions.post(data)`  | Adds a new entry. The `data` argument needs to be an `object`.                             |
| `actions.put(data)`   | Updates an entry. The `data` argument needs to be an `object` with an `id`.                |
| `actions.patch(data)` | Updates an entry. The `data` argument needs to be an `object` with an `id`.                |
| `actions.remove(id?)` | Removes your collection. Can remove an individual entry if an `id` (`string`) is provided. |

##### `data`

Type: `Array`

The collection of your entries.

##### `didInitialFetch`

Type: `boolean`

`useMoxie` does an initial `GET` request for your collection on load. This property indicates whether that initial request has been performed. This is useful for rendering an initial loading UI.

##### `hasData`

Type: `boolean`

Whether your collection has entries.

##### `isPending`

Type: `function(object|string)`

Checks whether an entry is being processed. An entry is considered "pending" after an action is called, but before it is fully resolved from Moxie.

###### Example:

```js
<div key={entry.id}>
	{entry.title}
	<br />
	{isPending(entry) ? 'Ready' : '...'}
</div>
```

##### `loading`

Type: `boolean`

`useMoxie` toggles this property whenever an action is performed.

##### `pending`

Type: `Array<string>`

An array of entries (ids) that are currently being processed. An entry is considered "pending" after an action is called, but before it is fully resolved from Moxie.

### useMoxieState({ username, collection, initialState, actionReducer })

Used to manage state (`object`).

Note: Updates (from `setState`) from the `useMoxieState` hook makes a network request to Moxie server. Avoid making rapid updates (e.g. update per keystroke).

##### `username`

Type: `string`

Your username for Moxie. It must start with an `@`. Example: `@itsjonq`.

##### `collection`

Type: `string`

The name of the collection for your state data. If it doesn't exist under your Moxie username, Moxie will create it for you automatically when you add your first entry. Note: This collection should be different from your an existing Moxie / `useMoxie()` collection.

##### `initialState`

Type: `Object`

Data to set as initial state. This state will be synced with Moxie on initial load.

##### `actionReducer`

Type: `function`

A callback function that dispatches events when `useMoxie` performs API actions.

Example:

```jsx
const { actions, data, didInitialFetch, loading } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo-state',
	actionReducer: (type) => console.log(type),
});
```

#### Props

The `useMoxieState` hook provides a handful of useful props:

```jsx
const {
	state,
	setState,
	removeState,
	didInitialFetch,
	hasData,
	isPending,
	pending,
	loading,
} = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo-state',
});
```

Many of these props are the same from the `useMoxie` hook.

##### `state`

Type: `object`

The state.

```jsx
const { state, setState } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo-state',
	initialState: {
		active: false,
	},
});

console.log(state);
// { active: false }
```

##### `setState`

Type: `function`

Method used to update state. `setState` updates the state both locally and on Moxie.

```jsx
const { state, setState } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo-state',
	initialState: {
		active: false,
	},
});

console.log(state);
// { active: false }

setState({ active: true });

console.log(state);
// { active: true }
```

##### `removeState`

Type: `function`

Method used to remove state. Use this if you need to reset this.

```jsx
const { state, removeState } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo-state',
	initialState: {
		active: false,
	},
});

console.log(state);
// { active: false }

removeState();

console.log(state);
// {}
```

## Example

Check out our [simple example](https://codesandbox.io/s/use-moxie-demo-u3erf?file=/src/App.js).

## Offline Support

`useMoxie` has some basic offline support. It will save actions to `localStorage` while you are offline. Once you're back online, it will try to synchronize the offline modifications.
