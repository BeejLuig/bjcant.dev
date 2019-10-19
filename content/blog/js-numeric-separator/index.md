---
title: JS Numeric Separator
description: A new ECMAScript feature you can try out right now!
date: 2019-10-19
---

Here's a new ECMAScript feature that I am excited about: numeric separators. Currently in [proposal stage 3](https://github.com/tc39/proposal-numeric-separator), this readability feature will make it much easier for our eyes to parse numbers. If you have Chrome version 75 or above -- find your version by typing `chrome://version/` in your URL input -- you can test out this feature in Chrome dev tools right now!

```js
// try this in the console
let oneMillion = 1_000_000
```

The underscore can be place between any numeric values, including after a decimal.

```js
let pi = 3.141_592_653
```

You may notice that the actual numeric value omits the separator. Don't get too attached!

```js
pi
//=> 3.141592653
```

This is especially useful for separating binary numbers.

```js
let binary = 0b1101_1100_0000
```

It also works for [hexadecimal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Hexadecimal_numbers)...

```js
let abc = 0xA_B_C
```

[BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)...

```js
let frickinHugeInt = 1_000_000_000_000_000_000_000n
```

... and [exponential](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Exponentiation) notation!

```js
let infinitePi = 3.145e1_000
```

Separators can be placed in unconventional places, too.

```js
let kwazyInt = 43_8_83998_123_583_1_0
```

Not sure why you would want to do that 🤷‍.

There are some limitations to the separator. These are the things you _can't_ do:

Place underscores at the beginning or end of a number

```js
// no
_1000

// nope
1000_
```

Place underscores adjacent to a non-numeric character

```js
// nah
1_.348

// also nah
5.43_e2
```

Place underscores adjacent to each other

```js
// nice try
1__000__000
```

Remember, this feature is still in proposal phase and as of this writing is not available on browsers other than Chrome. For Node apps, you will need to be running on v12.5 or higher. If you want to use this on the web, your only viable option for now is to transpile your JS with [Babel](https://babeljs.io/docs/en/babel-plugin-proposal-numeric-separator), unless of course you are confident that all of your users are on the latest Chrome 😜. Gotta keep 'em separated!