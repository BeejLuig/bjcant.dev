---
  title: Cancel Fetch with AbortController
  description: 
  date: 2019-12-01
---

If you are like me, you have wondered if there is a way to cancel a fetch request. Well, there is good news: most modern browsers now support the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) API, which we can use to do just that! Let's see how it works. 

`AbortController` is a standalone object that can interface with the `fetch` method. The API for `AbortController` is pretty simple. We can instantiate a new controller with the constructor:

```js
const controller = new AbortController();
```

The `controller` instance has just one property, `controller.signal`, and one method, `controller.abort()`. The `signal` property is an object with a boolean `aborted` property and an `abort` event listener. Try this out in the console.

```js
// check the aborted status
controller.signal.aborted
//=> false

// setup 'abort' event listener
controller.signal.onabort = () => console.log('Aborted!');

controller.abort()
// logs: 'Aborted!'

controller.signal.aborted
//=> true
```

First, we check the read-only `aborted` property, which is `false` by default. Calling `controller.abort()` flips that value to `true` with no way to flip it back. Once an instance of `AbortController` is used, we need to create a new instance to reset the value. 

How does this object interface with `fetch`? We can pass the `signal` as a fetch option like so:

```js
const controller = new AbortController();

fetch(url, { signal: controller.signal })
```

When we pass a `signal` option to `fetch`, it creates a listener for the `abort` event and will throw an error if `controller.abort()` is called during the DOM request or while reading the request body. 

Now let's see a working example.

We have a button that fetches a large image and sets it as the background. The fetch button becomes an abort button while the request is being made. 

> To see this in action, you may need to double-click pretty quickly, depending on your internet speed. The browser may cache the image after the first time it loads, so you may need to clear application storage if you want to try aborting the fetch multiple times.

<iframe
     src="https://codesandbox.io/embed/gracious-franklin-0u0vz?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="fetch-abortcontroller"
     allow="encrypted-media"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>


Let's walk through this code. We can start with an initial `App` template:


```jsx
function App() {
  return (
    <div
      className="App">
      <nav>
        <button>Fetch image</button>
      </nav>
    </div>
  );
}
```

The idea here is to wire up the button to fetch the image, then set it as the background of the `App` container. Let's see that:

```jsx{2-8,13,16}
function App() {
  const [url, setUrl] = useState();
  const fetchData = () => {
    setUrl();
    return fetch("./buildings.jpg")
      .then(r => r.blob())
      .then(blob => setUrl(URL.createObjectURL(blob)))
  };

  return (
    <div
      className="App"
      style={{backgroundImage: `url(${url})`}}
    >
      <nav>
        <button onClick={fetchData}>Fetch image</button>
      </nav>
    </div>
  );
}
```

So now the button is bound to the `fetchData` function, which creates a blob URL for the image and sets it to state, which in turn sets the background. Let's add loading and error states.

```jsx{3-4,8-9,13-14,24-25}
function App() {
  const [url, setUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setUrl();
    setError(false);
    setLoading(true);
    return fetch("./buildings.jpg")
      .then(r => r.blob())
      .then(blob => setUrl(URL.createObjectURL(blob)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  return (
    <div
      className="App"
      style={{backgroundImage: `url(${url})`}}
    >
      <nav>
        <button onClick={fetchData}>Fetch image</button>
      </nav>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  );
}
```

From here, adding the abort functionality is pretty easy. We just need to add an `AbortController`, wire up the `abort` button and pass the `signal` to `fetch`!

```jsx{1,2,10,16,25-26}
let controller = new AbortController();
const abort = () => controller.abort();

function App() {
  const [url, setUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = () => {
    controller = new AbortController();
    setUrl();
    setError(false);
    setLoading(true);
    return fetch(
      "./buildings.jpg",
      { signal: controller.signal }
    ).then(r => r.blob())
      .then(blob => setUrl(URL.createObjectURL(blob)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  return (
    <div className="App" style={{ backgroundImage: `url(${url})` }}>
      <nav>
        {!loading && <button onClick={fetchData}>Fetch image</button>}
        {loading && <button onClick={abort}>Abort fetch</button>}
      </nav>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  );
}
```

You may be wondering why the `controller` variable is initially declared outside of the component. Remember that the `controller.abort()` functionality is a one-time use. Defining the `controller` inside the component risks object reference issues, i.e. `abort()` could be referencing the incorrect `AbortController` instance, rendering it useless. We want a fresh controller setup before every fetch, but we also need to ensure that the the `abort()` method is referring to the correct controller!

**Conclusion**

It turns out that aborting fetch requests is pretty simple with `AbortController`! Although the live example is in React, the concepts apply for any framework. Keep in mind that this _does not_ work for Internet Explorer, so be sure to consider browser support before using this on production apps. For more information about `AbortController`, check out [this article](https://developers.google.com/web/updates/2017/09/abortable-fetch) by Jake Archibald.