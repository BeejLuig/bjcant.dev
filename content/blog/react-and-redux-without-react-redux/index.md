---
title: React and Redux without React-Redux
description: 
date: 2019-10-31
draft: true
---

When bootstrapping an application using React and Redux, most of us tend to include the [react-redux](https://react-redux.js.org/) library, and for good reason: it contains _the official React bindings for Redux_. The react-redux docs to a good job at explaining why anyone would want to use it, but I don't think many people know or understand something important:

**Using React with Redux doesn't require react-redux.**

It's true that react-redux is best-equipped to handle the interaction between Redux state and React components; after all, it's [authored by the same people](https://github.com/reduxjs/react-redux/graphs/contributors). I've spent a lot of time dreaming up comprehensive alternatives, and they all end up looking like a less-polished version of react-redux. So why skip out on this library? For me, it comes down to one thing: **boilerplate**. Getting up and running with react-redux is exhausting.

With a willingness to accept some tradeoffs, we can pretty easily pull a Redux store into an app with three extra lines of code. Yep, _just three lines_. Take a look:

```jsx{12-17}
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'

const reducer = (state={}, action) => { /* ...reducer logic */}
const store = createStore(reducer)

function App({ state, dispatch }) {
  return (/* ...render something */)
}

const update = () => render(
  <App state={store.getState()} dispatch={store.dispatch} />,
  document.getElementById('app')
)
store.subscribe(update)
update()
```

