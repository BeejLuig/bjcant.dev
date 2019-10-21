---
title: Refactoring Reducers with Immer
description: Make immutable state <em>feel</em> mutable
date: 2019-10-21
---

The new hotness in immutable state management is [Immer](https://immerjs.github.io/immer/docs/introduction), a lightweight package designed to make operating on immutable objects a breeze. 

> Using Immer is like having a personal assistant; he takes a letter (the current state) and gives you a copy (draft) to jot changes onto. Once you are done, the assistant will take your draft and produce the real immutable, final letter for you (the next state). - [Immer](https://immerjs.github.io/immer/docs/introduction)

I had a lot of fun refactoring a Redux app to use Immer, so I wanted to share how easy it really is!

Here is an example of a "standard" user reducer:

```js
const initialState = {
  meta: {
    loading: true,
    error: false
  },
  data: []
}

export default (state=initialState, action={}) => {
  switch (action.type) {
    case 'USERS_LOAD':
      return {
        ...state,
        meta: {
          ...state.meta,
          loading: true,
          error: false
        }
      }
    case 'USERS_LOAD_SUCCESS':
      return {
        ...state,
        data: [...action.payload.data],
        meta: {
          ...state.meta,
          loading: false,
          error: false
        }
      }
    case 'USERS_LOAD_FAILURE':
      return {
        ...state,
        meta: {
          ...state.meta,
          loading: false,
          error: action.payload.error
        }
      }
    default:
      return state
  }
}
```

This should seem very familiar. We have a function that accepts the current `state` and an `action` as arguments and returns a new `state` copy with alterations based on `action.type` and an optional `action.payload`. We see a lot of object rest spreads (i.e. the ellipses or `...`), which can become verbose and error-prone when we get into larger nested structures. One could argue that each state managed by a reducer should have a flat data structure, but in practice that is a rare occurrence. 

Immer allows us to simplify this pattern by operating on a `draft` copy of the state _as if it is mutable_. To see what that looks like, let's refactor this reducer.

First, will import the `produce` function and put the reducer and `initialState` in as the arguments of the `produce` call.

```js{1,11-12,43-45}
import produce from 'immer'

const initialState = {
  meta: {
    loading: true,
    error: false
  },
  data: []
}

export default produce(
  (state, action={}) => {
    switch (action.type) {
      case 'USERS_LOAD':
        return {
          ...state,
          meta: {
            ...state.meta,
            loading: true,
            error: false
          }
        }
      case 'USERS_LOAD_SUCCESS':
        return {
          ...state,
          data: [...action.payload.data],
          meta: {
            ...state.meta,
            loading: false,
            error: false
          }
        }
      case 'USERS_LOAD_FAILURE':
        return {
          ...state,
          meta: {
            ...state.meta,
            loading: false,
            error: action.payload.error
          }
        }
      default:
        return state
    }
  }, 
  initialState
)
```

Next, we're going to rename `state` to `draft`. This is just so we can stick with the Immer's concept of manipulating a "draft state". For more context, check out the Immer docs.

```js{12,16,18,25,28,35,37,43}
import produce from 'immer'

const initialState = {
  meta: {
    loading: true,
    error: false
  },
  data: []
}

export default produce(
  (draft, action={}) => {
    switch (action.type) {
      case 'USERS_LOAD':
        return {
          ...draft,
          meta: {
            ...draft.meta,
            loading: true,
            error: false
          }
        }
      case 'USERS_LOAD_SUCCESS':
        return {
          ...draft,
          data: [...action.payload.data],
          meta: {
            ...draft.meta,
            loading: false,
            error: false
          }
        }
      case 'USERS_LOAD_FAILURE':
        return {
          ...draft,
          meta: {
            ...draft.meta,
            loading: false,
            error: action.payload.error
          }
        }
      default:
        return draft
    }
  }, 
  initialState
)
```

In order to manipulate state within the `produce` function, we just need to identify the changes we actually want to make. Let's take the first original switch case as an example:

```js
case 'USERS_LOAD':
  return {
    ...state,
    meta: {
      ...state.meta,
      loading: true,
      error: false
    }
  }
```

What values are really changing? Just `state.meta.loading` and `state.meta.error`.

With Immer, we can represent these changes by simply operating on the `draft` state like it is mutable and the `produce` function will return a read-only copy without us needing to explicitly return anything.

```js
case 'USERS_LOAD':
  draft.meta.loading = true
  draft.meta.error = false
  return
```

Since we don't need to return any data within the `produce` callback, we can skip the `default` case too. The entire refactor will look like this:

```js
import produce from 'immer'

const initialState = {
  meta: {
    loading: true,
    error: false
  },
  data: []
}

export default produce(
  (draft, action={}) => {
    switch (action.type) {
      case 'USERS_LOAD':
        draft.meta.loading = true
        draft.meta.error = false
        return
      case 'USERS_LOAD_SUCCESS':
        draft.data = action.payload.data
        draft.meta.loading = false
        draft.meta.error = false
        return
      case 'USERS_LOAD_FAILURE':
        draft.meta.loading = false
        draft.meta.error = action.payload.error
        return
    }
  }, 
  initialState
)
```

The `draft` is actually a proxy of the current state. Based on the changes to the `draft`, Immer will determine which parts of the state can be re-used and which require a new copy. 

## Conclusion

What do you think? Does this look better or worse, simpler or more more complex? To me, this is definitely a smaller, more concise reducer. If you want to learn more about this approach, I recommend checking out the [curried `produce` section of the Immer docs](https://immerjs.github.io/immer/docs/curried-produce).