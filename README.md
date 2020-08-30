# 🔗 use-moxie

[![npm version](https://badge.fury.io/js/use-moxie.svg)](https://badge.fury.io/js/use-moxie)

> React hooks that integrates with [Moxie](https://usemoxie.xyz/) - an online REST API for prototyping.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [API](#api)
    -   [useMoxie({ username, collection, actionReducer })](#usemoxie-username-collection-actionreducer-)
-   [Props](#props)
-   [Example](#example)

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
	const { actions, data, didInitialFetch, loading } = useMoxie({
		username: '@itsjonq',
		collection: 'use-moxie-demo',
	});

	if (!didInitialFetch && loading) {
		return <div>...</div>;
	}

	return <div>Ready!</div>;
};
```

## API

### useMoxie({ username, collection, actionReducer })

#### `username`

Type: `string`

Your username for Moxie. It must start with an `@`. Example: `@itsjonq`.

#### `collection`

Type: `string`

The name of the collection for your data. If it doesn't exist under your Moxie username, Moxie will create it for you automatically when you add your first entry.

#### `actionReducer`

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

| Action Type      | Description                   |
| ---------------- | ----------------------------- |
| `GET_FAILED`     | `get` request has failed.     |
| `GET_STARTED`    | `get` request has started.    |
| `GET_SUCCESS`    | `get` request has succeed.    |
| `POST_FAILED`    | `post` request has failed.    |
| `POST_STARTED`   | `post` request has started.   |
| `POST_SUCCESS`   | `post` request has succeed.   |
| `PUT_FAILED`     | `put` request has failed.     |
| `PUT_STARTED`    | `put` request has started.    |
| `PUT_SUCCESS`    | `put` request has succeed.    |
| `DELETE_FAILED`  | `delete` request has failed.  |
| `DELETE_STARTED` | `delete` request has started. |
| `DELETE_SUCCESS` | `delete` request has succeed. |

## Props

The `useMoxie` hook provides a handful of useful props:

```jsx
const { actions, data, didInitialFetch, loading } = useMoxie({
	username: '@itsjonq',
	collection: 'use-moxie-demo',
});
```

#### `actions`

Type: `object`

Actions contains a collection of RESTful actions you can perform on your Moxie collection:

| Method                | Description                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `actions.get(id?)`    | Fetches your collection. Can fetch an individual entry if an `id` (`string`) is provided.  |
| `actions.post(data)`  | Adds a new entry. The `data` argument needs to be an `object`.                             |
| `actions.put(data)`   | Updates an entry. The `data` argument needs to be an `object` with an `id`.                |
| `actions.patch(data)` | Updates an entry. The `data` argument needs to be an `object` with an `id`.                |
| `actions.remove(id?)` | Removes your collection. Can remove an individual entry if an `id` (`string`) is provided. |

#### `data`

Type: `array`

The collection of your entries.

#### `didInitialFetch`

Type: `boolean`

`useMoxie` does an initial `GET` request for your collection on load. This property indicates whether that initial request has been performed. This is useful for rendering an initial loading UI.

#### `loading`

Type: `boolean`

`useMoxie` toggles this property whenever an action is performed.

## Example

Check out our [simple example](https://codesandbox.io/s/use-moxie-demo-u3erf?file=/src/App.js).
