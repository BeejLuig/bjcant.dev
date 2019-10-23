---
title: One Liners - FizzBuzz
description: 
date: 2019-10-24
---

FizzBuzz is possibly the most well-known coding challenge out there. There are many flavors of this problem, but the version that most candidates see in coding interviews looks something like the description on [Leet Code](https://leetcode.com/problems/fizz-buzz/):

> Write a program that outputs [a list of] the string representation of numbers from 1 to `n`.
>
> But for multiples of three it should output “Fizz” instead of the number and for the multiples of five output “Buzz”. For numbers which are multiples of both three and five output “FizzBuzz”.

I've seen this problem on both sides of the interview table, and usually the JavaScript solutions are pretty standard: a for-loop wrapping if/else statements and conditionals using the uncommon modulus or remainder (i.e. `%`) operator. For fun, I'm going to share with you my one-liner solution and compare notes with a "regular" one in this deep-dive.

> **NOTE**: _I do not recommend doing anything like this in an interview...one-liners can be difficult to read and speak on_

## Review: The Regular Solution

Here is a FizzBuzz solution that I have seen so many times in so many places:

```js
function fizzBuzz(max) {
  const result = []
  for (let i=1; i<= max; i++) {
    let str = ''

    if (i % 15 === 0) {
      result.push('FizzBuzz')
    } else if (i % 3 === 0) {
      result.push('Fizz')
    } else if (i % 5 === 0) {
      result.push('Buzz')
    } else {
      result.push(String(i))
    }
  }
  return result
}
```

The nice thing about this solution is that it essentially steps through the problem statement. Here are the steps of the algorithm:

- Create a `result` array
- Loop through the range of 1 to `max`
- If the number is divisible by 3 and 5 (i.e. 15), add 'FizzBuzz' to the array
- If the number is divisible by just 3, add 'Fizz' to the array
- If the number is divisible by just 5, add 'Buzz' to the array
- Default to adding the stringified number to the array of the above conditions aren't met
- Return the result

This is clean an simple, and there's not much to optimize. Maybe a switch statement would be better than multiple else-ifs, and maybe we could find a way to combine 'Fizz' and 'Buzz' instead of handling numbers divisible by 15 separately.

## The One Liner

```js
const fizzBuzz = max => Array(max).fill().map((_,i) => String(((i + 1) % 3 === 0 ? 'Fizz' : '') + ((i + 1) % 5 === 0 ? 'Buzz' : '')) || i + 1)
```

Ahh, there's nothing like horizontal scrolling on your phone to try and make sense of code. Here's the same solution, but hopefully a bit more legible:

```js
const fizzBuzz = max => Array(max).fill().map(
  (_,i) => String(
    (
      (i + 1) % 3 === 0 ? 'Fizz' : '')
      + ((i + 1) % 5 === 0 ? 'Buzz' : '')
    ) || i + 1
)
```

## The Breakdown

What's going on here? How does one arrive at a similar solution? For me, it starts with understanding the expected inputs and outputs. There is only one expected input this problem, a positive integer -- that's easy enough. If we break down the expected output to the simplest parts, we have this:

- An array where each element is one of three:
  - 'Fizz'
  - 'Buzz'
  - 'FizzBuzz'
  - the stringified number

## Part I

We know that the conditions for 'Fizz' and 'Buzz' are combined for 'FizzBuzz', so why not combine the actual values? That's where we get the first bit of logic. If we want to "one-line" the if/else statements, we should use a [ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator, which MDN illustrates as:

```js
condition ? exprIfTrue : exprIfFalse
```

Let's look back at the if/else logic for FizzBuzz, this time in the context of a function that returns the string result for a single number

```js
function fizzBuzzify(n) {
  if (i % 15 === 0) {
    return 'FizzBuzz'
  } else if (n % 3 === 0) {
    return 'Fizz'
  } else if (n % 5 === 0) {
    return 'Buzz'
  } else {
    return String(n)
  }
}
```

What would this logic look like -- as is -- with ternaries?

```js
function fizzBuzzify(n) {
  return (
    n % 15 === 0 ? 'FizzBuzz'
    : n % 3 === 0 ? 'Fizz'
    : n % 5 === 0 ? 'Buzz'
    : String(n)
  )
}
```

Nested ternaries work, but they aren't very easy to read or comprehend what's going on. We can consolidate this logic further by separating the pieces. If we want to combine 'Fizz' and 'Buzz', we can do that pretty easily with string concatenation.

```js
(n % 3 === 0 ? 'Fizz' : '') + (n % 5 === 0 ? 'Buzz' : '')
```

With this logic, we've got a few possible combinations

```js
1. '' + ''         //=> ''
2. 'Fizz' + ''     //=> 'Fizz'
3. '' + 'Buzz'     //=> 'Buzz'
4. 'Fizz' + 'Buzz' //=> 'FizzBuzz'
```

From here, we can take advantage of JavaScript's **lazy evaluation** feature, meaning that code won't be executed until it is necessary. We can return `n` as a default value by simply adding it after the boolean OR operator (i.e. `||`). If `n` is divisible by neither 3 nor 5, our ternary/concatenation logic will return an empty string, which is indeed falsey and our code will fallback to `n`. As a final optimization, if we are _always_ returning a string data type, we can wrap all of the logic in the `String` method. Our function now looks like this:

```js
function fizzBuzzify(n) {
  return String(
    (n % 3 === 0 ? 'Fizz' : '')
    + (n % 5 === 0 ? 'Buzz' : '')
    || n
  )
}
```

### Part II

Now that we tackled the if/else logic, we can turn our attention to the loop. Let's insert our `fizzBuzzify` function into the original solution.

```js
function fizzBuzz(max) {
  const result = []
  for (let i=1; i<= max; i++) {
    let str = fizzBuzzify(i)
    result.push(str)
  }
  return result
}
```

What would be the best way to simplify this loop into one line? We need to return an array, so we could start with an array of length `max` and map over that. But how to create an empty array with a given length? My first thought is to use the `Array` constructor. If you pass an integer as the only argument, an empty array with the given length is returned.

```js
Array(10)
//=> [empty × 10]
```

There's just one problem, we can't operate on an empty array with `map` because "empty" actually means it has _no_ value, not even `undefined` or `null`! Let's try to return a map of the array with each index as an element.

```js
Array(10).map((_, i) => i)
//=> [empty × 10]
```

As you can see, we aren't getting what we would expect. A regular for-loop would work, but we aren't trying to be practical here. We're trying to be unnecessarily brief! We can literally fill every slot of the array with the `.fill()` method. 

```js
Array(10).fill().map((_, i) => i)
//=> [0,1,2,3,4,5,6,7,8,9]
```

There we go! At this point I want to make a note that there are a number of ways to create an array of a given length, but this is the [fastest one-line solution](https://jsperf.com/array-of-numbers-from-0-to-n) that I have seen. A single loop would be _the fastest of them all_, but again, we're looking for the one-lineriest solution, not the best one.

So with the original loop logic replaced by our new logic, we now have this:

```js
function fizzBuzzify(n) {
  return String(
    (n % 3 === 0 ? 'Fizz' : '')
    + (n % 5 === 0 ? 'Buzz' : '')
    || n
  )
}

function fizzBuzz(max) {
  return Array(max).fill().map((_, i) => {
    return fizzBuzzify(i + 1)
  })
}
```

We pass `i + 1` in the call to `fizzBuzzify` because our array is 0-indexed and FizzBuzz starts from 1. 

## Putting it All Together

The last step is putting the `fizzBuzzify` logic directly into the callback of `.map()`. For good measure, we can also replace the `function` declaration with an arrow function so it's _all one line_. 

```js
// prettified for your viewing pleasure
const fizzBuzz = max => Array(max).fill().map(
  (_, i) => String(
    ((i + 1) % 3 === 0 ? 'Fizz' : '')
    + ((i + 1) % 5 === 0 ? 'Buzz' : '')
    || i + 1
  )
)
```

And that's it!

## Conclusion

Understanding method chaining and basic functional programming techniques can really help up your game as a JavaScript developer, and finding ways to write complex logic in one line can be a fun way to practice. It's just as important to understand when to use _and avoid_ these techniques. Maybe you can impress your friends with a one-liner FizzBuzz, but in a production or interview environment, _nobody_ is going to to be happy about parsing all of those parentheses. Chaining methods can be very fast, but they can also be much slower than more "traditional" approaches (i.e. loops) if you aren't careful about your choices. 

If you're interested to know the execution performance of this one-liner versus the original, you can check out the [JSPerf test here](https://jsperf.com/fizzbuzz-one-liner-against-loop/). Spoiler alert: my test run showed the one-liner execute at 109 operations per second, with the original only hit 74.92 ops/sec.

I'm hoping to turn one-liners into a series, but I just need good challenges to use. If you'd like to see a one-liner deep dive on a different coding challenge, please let me know!
