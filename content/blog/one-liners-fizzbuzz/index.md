---
title: One Liners - FizzBuzz
description: 
date: 2019-10-23
draft: true
---

FizzBuzz is possibly the most well-known coding challenge out there. There are many flavors of this problem, but the version that most candidates see in coding interviews looks something like the description on [Leet Code](https://leetcode.com/problems/fizz-buzz/):

> Write a program that outputs [a list of] the string representation of numbers from 1 to `n`.
>
> But for multiples of three it should output “Fizz” instead of the number and for the multiples of five output “Buzz”. For numbers which are multiples of both three and five output “FizzBuzz”.

I've seen this problem on both sides of the interview table, and usually the JavaScript solutions are pretty standard: a for-loop wrapping if/else statements and conditionals using the uncommon modulus or remainder (i.e. `%`) operator. For fun, I'm going to share with you my one-liner solution and compare notes with a "regular" one in this deep-dive.

> **NOTE**: _I do not recommend doing anything like this in an interview...one-liners can be difficult to read and comprehend_

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

This is clean an simple, and there's not much to optimize. Maybe a switch statement would be better than multiple else-ifs, and maybe we could find a way to combine 'Fizz' and 'Buzz' instead of handling numbers divisible by 15 separately. The time complexity of this problem should be O(n), since the algorithm loops once for every number in the given range.

## The One Liner

```js
const fizzBuzz = max => Array(max).fill().map((_,i) => String(((i + 1) % 3 === 0 ? 'Fizz' : '') + ((i + 1) % 5 === 0 ? 'Buzz' : '')) || i + 1)
```

Ahh, there's nothing like horizontal scrolling on your phone to try and make sense of code. Here's the same solution, but hopefully a bit more legible:

```js
const fizzBuzz = max => Array(max)
  .fill()
  .map((_,i) => String(
    (
      (i + 1) % 3 === 0 ? 'Fizz' : '')
      + ((i + 1) % 5 === 0 ? 'Buzz' : '')
    ) || i + 1
  )
```

What's going on here? How does one arrive at a similar solution? For me, it starts with understanding the expected inputs and outputs. There is only one expected input this problem, a positive integer -- that's easy enough. If we break down the expected output to the simplest parts, we have this:

- An array where each element is one of three:
  - 'Fizz'
  - 'Buzz'
  - 'FizzBuzz'
  - the stringified number

We know that the conditions for 'Fizz' and 'Buzz' are combined for 'FizzBuzz', so why not combine the actual values? That's where we get the first bit of logic. If we want to "one-line" the if/else statements, we should use a [ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator, which MDN illustrates as:

```js
condition ? exprIfTrue : exprIfFalse
```

Let's look back at the if/else logic for FizzBuzz, this time in the context of a function that returns the string result for a single number

```
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

Nested ternaries aren't very fine, but they aren't very easy to read or comprehend what's going on. We can consolidate this logic further by separating the pieces. If we want to combine 'Fizz' and 'Buzz', we can do that pretty easily with string concatenation.

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

