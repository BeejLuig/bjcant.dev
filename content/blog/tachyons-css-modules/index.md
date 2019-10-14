---
title: Composing Styles with Tachyons and CSS Modules
description: Harnessing the power of utility-first CSS.
date: 2019-10-15
---

For a while now, I have used [CSS modules](https://github.com/css-modules/css-modules) to style applications at work. If you have never used CSS modules before, it can be a great solution for scoped, composable styles. Building a shared component library? CSS Modules will be your friend! 

My team started working on a project that couples CSS modules with [Tachyons](http://tachyons.io/), a small open-source CSS library of utility classes. If you are familiar with [tailwindcss](https://tailwindcss.com/), Tachyons is comparable but much more simple. Contrary to most style patterns, utility-based CSS libraries like Tachyons discourage the use of the cascade, preferring instead to use class names that describe the style property and value. 

Using [an example of a heading](http://tachyons.io/components/text/title-subtitle-centered/index.html):

```html
<h1 class="f3 f2-m f1-l fw2 black-90 mv3">
  This is the title
</h1>
```

Each class represents a single style. The Tachyons design system is mobile-first, so `f3` represents the third largest font-size by default, while `f2-m` and `f1-l` represent increasing font-sizes for medium and large screens, respectively. `fw2` is the second-largest font-weight, `mv3` the third-largest vertical margin (top and bottom), and `black-90` is simply a black text color with `.9` opacity. The condensed names can take a while to get used to, but there are some nice lookup tools like [tachyons-tldr](https://tachyons-tldr.now.sh).

You may be able to see some drawbacks of this already. For me, there are two big ones:
1. **It's repetitive**: Want the text-color to be `rgba(0,0,0,.9)` for all copy? _Every tag_ needs the class name!
1. **It's verbose**: If one tag requires some complex styling, you will be looking at a _long line of class names_. This is particularly apparent with media queries, as with the font-size above (i.e. `f3 f2-m f1-l`). 

Combine Tachyons with CSS Modules and you have a solution to both of these problems: **class name composition**! I want to take you through my approach to this pattern using Webpack.

## Setup the project

We're going to build a simple profile-card component from the [Tachyons component library](http://tachyons.io/components/cards/profile-card-title-subtitle/index.html). Let's get started by creating a new project with subfolders.

```sh
mkdir -p css-modules-tachyons-demo/{src,dist,vendors}
cd css-modules-tachyons-demo && npm init --yes
```

Now we'll include webpack and the basic loaders and plugins to build a single page application.

```sh
npm install --save-dev webpack webpack-cli webpack-dev-server \
  html-webpack-plugin css-loader style-loader
```

We're going to include [tachyons-custom](https://github.com/tachyons-css/tachyons-custom) -- a fork of the main Tachyons library with all variables definitions in a single file -- and move the source into our `/vendors` folder.

```sh
npm install --save-dev tachyons-custom
cp -r node_modules/tachyons-custom/src/ vendors/tachyons/
```

> Why copy all of the source files over? The Tachyons team [recommends it](https://vimeo.com/174698456). Tachyons is meant to be overridden and extended (via CSS variables or otherwise).

Almost ready to write some code! Just need to add a few files:

```sh
touch index.html webpack.config.js src/index.js src/styles.css
```

## Initial template

Let's start with a simple template.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
```

```js
// src/index.js
import '../vendors/tachyons/tachyons.css';

document.getElementById('app').innerHTML = `
  <article class="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
    <div class="tc">
      <img 
        src="http://tachyons.io/img/avatar_1.jpg" 
        class="br-100 h4 w4 dib ba b--black-05 pa2" 
        title="Photo of a kitty staring at you"
      >
      <h1 class="f3 mb2">Mimi W.</h1>
      <h2 class="f5 fw4 gray mt0">CCO (Chief Cat Officer)</h2>
    </div>
  </article>
`;
```

## Build configuration

We're going to add the basic webpack config,

```js
// webpack.config.js
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ]
    }]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'CSS Modules + Tachyons',
      template: 'index.html'
    })
  ]
}
```

and add the `build` and `serve` scripts in `package.json`.

```json
{
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack"
  }
}
```

Now, we should be able to run the app and see the styled profile card!

```sh
npm start
```

## The gotcha

Wait...**EVERYTHING BROKE**...what just happened?

You're probably seeing about two-dozen errors that look something like this:

```sh
ERROR in ./vendors/tachyons/tachyons.css (./node_modules/css-loader/dist/cjs.js!./vendors/tachyons/tachyons.css)
Module not found: Error: Can't resolve './_aspect-ratios' in '/Users/<user>/code/css-modules-tachyons-demo/css-modules-tachyons-demo/vendors/tachyons'
 @ ./vendors/tachyons/tachyons.css (./node_modules/css-loader/dist/cjs.js!./vendors/tachyons/tachyons.css) 5:10-81
 @ ./vendors/tachyons/tachyons.css
 @ ./src/index.js
```

Take a look at `vendors/tachyons/tachyons.css`. What do you notice? There are no styles defined in that file! Instead, it is full of `@import` statements. When `css-loader` is looking at `tachyons.css`, it doesn't look any deeper to process imported modules. To get module composition to play nice with `@import`, we need to bring [PostCSS](https://github.com/postcss/postcss) into our build process. Let's install 3 more packages.


```sh
npm install --save-dev postcss postcss-loader postcss-import
```

Now, we need to create a config file for `postcss` and add `postcss-loader` to our Webpack config.

```sh
touch postcss.config.js
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import')()
  ]
}
```

[postcss-import](https://github.com/postcss/postcss-import) processes inlines `@import` statements. We need that to run _before_ `css-loader`, so we're going to modify the CSS rule.

```js{6-12}
// webpack.config.js
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    'postcss-loader'
  ]
}
```

The `importLoaders` option tells `css-loader` how many loaders to run before `css-loader` executes. We want `postcss-import` to process all the `@import` statements, _then_ interpret the CSS Modules.

Since we updated the Webpack config, we need to kill the local server and run it again. Everything should be working again!

## Turn on CSS Modules

Ok, now for the fun part! We're going to update our `css-loader` options to allow CSS modules, then refactor.

In `webpack.config.js`, update the CSS rule again.

```js{9-11}
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: '[name]__[local]',
        },
      }
    },
    'postcss-loader'
  ]
}
```

This enables the `modules` option and renames all imported CSS classes to the specified pattern. In this case `[name]` is the filename the style is imported from, and `[local]` is the actual class name.

Now, we're going to refactor the profile card markup to use a single class name reference for each tag. In `index.js`, change the import to point to our local CSS file.

```js
// index.js
import styles from './styles.css';

document.getElementById('app').innerHTML = `
  <article class="${styles.profileCard}">
    <div class="${styles.profileCardBody}">
      <img 
        src="http://tachyons.io/img/avatar_1.jpg" 
        class="${styles.profileCardImage}" 
        title="Photo of a kitty staring at you"
      >
      <h1 class="${styles.profileCardTitle}">Mimi W.</h1>
      <h2 class="${styles.profileCardSubtitle}">CCO (Chief Cat Officer)</h2>
    </div>
  </article>
`;
```

If you run the app and inspect the page, we should see that the app isn't styled and all of the tags have `class="undefined"`. Why would that be? With CSS Modules turned on, we can import a `styles` object from `./styles.css`. Since `styles.css` is empty, so is the `styles` object! Let's try adding a style.

```css
/* src/styles.css */
.profileCard {
  max-width: 3rem;
  margin-left: auto;
  margin-right: auto;
}
```

Inspect the app now, and you should see the styles applied, along with a new class name.

```html
<article class="style_profileCard">...</article>
```

## Composition

With CSS Modules, we can _compose_ class selectors with a special `composes` rule. Let's try `composing` the styles we just added to `.profileCard`. 

```css
/* src/styles.css */
.mw3 { max-width: 3rem; }
.center { 
  margin-left: auto;
  margin-right: auto;
}

.profileCard {
  composes: mw3 center;
}
```

As you can see, multiple classes can be added to a single `composes` rule by space-separating them. For more detail on composition syntax, checkout the [CSS Modules docs](https://github.com/css-modules/css-modules#composition).

If we want to compose classes directly from Tachyons, we can import the CSS file first:

```css
/* src/styles.css */
@import '../vendors/tachyons/tachyons.css';

.profileCard {
  composes: mw3 center;
}
```

We have to be careful about this approach. In the context of our little demo this may suffice, but for a full-fledged application this could result in duplicate generation of the Tachyons library. Instead, we can compose classes directly from Tachyons.

```css
/* src/styles.css */
.profileCard {
  composes: mw3 center from '../vendors/tachyons/tachyons.css';
}
```


## Refactor

Now, let's refactor the styles for the rest of the component to use class name composition. For reference, here are the class mappings

|Module class|Tachyons classes|
|---|---|
|.profileCard|mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10|
|.profileCardBody|tc|
|.profileCardImage|br-100 h4 w4 dib ba b--black-05 pa2|
|.profileCardTitle|f3 mb2|
|.profileCardSubtitle|f5 fw4 gray mt0|

The pattern will look like this:

```css
[module_class]: {
  composes: [tachyons_classes] from '../vendors/tachyons/tachyons.css';
}
```

When all is said and done, our `styles.css` should look like this:

```css
/* src/styles.css */
.profileCard { 
  composes: mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 from '../vendors/tachyons/tachyons.css';
}
.profileCardBody { 
  composes: tc from '../vendors/tachyons/tachyons.css';
}
.profileCardImage { 
  composes: br-100 h4 w4 dib ba b--black-05 pa2 from '../vendors/tachyons/tachyons.css';
}
.profileCardTitle { 
  composes: f3 mb2 from '../vendors/tachyons/tachyons.css';
}
.profileCardSubtitle { 
  composes: f5 fw4 gray mt0 from '../vendors/tachyons/tachyons.css';
}
```

Looking good! Our profile card should look just as it did before, with all of the Tachyons class names applied to each tag. The only thing I _don't_ like here is the repetitive filepath to `tachyons.css`.

## Clean up

> This is the bonus round! At this point we have gone through everything necessary to develop an app using this pattern. Feel free to either stop here or keep trucking!

There are two quick ways that we can clean up the reference to the `tachyons.css` file. First, we can define a variable using the special `@value` from [CSS Modules](https://github.com/css-modules/css-modules/blob/master/docs/values-variables.md), which `css-loader` supports out of the box. 

```css
/* src/styles.css */
@value tachyons: '../vendors/tachyons/tachyons.css';

.profileCard { 
  composes: mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 from tachyons;
}
.profileCardBody { 
  composes: tc from tachyons;
}
.profileCardImage { 
  composes: br-100 h4 w4 dib ba b--black-05 pa2 from tachyons;
}
.profileCardTitle { 
  composes: f3 mb2 from tachyons;
}
.profileCardSubtitle { 
  composes: f5 fw4 gray mt0 from tachyons;
}
```

This looks nicer, but there are still a couple issues. For one, the `@value` statement will need to be repeated in every file that references Tachyons, and the relative filepath is subject to change. Also, there is a risk that the variable name can conflict with strings, which will break things if you mix and match `@value` variables and filepaths in `composes` rules.

Instead, I prefer to use Webpack's alias feature. We can define an alias name for Tachyons that will always resolve to the same place, no matter where it is imported from. 

In the top level of the Webpack config, add a `resolve` property.

```js{23-27}
// webpack.config.js
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]',
            },
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    }]
  },
  resolve: {
    alias: {
      tachyons$: path.resolve(__dirname, 'vendors/tachyons/tachyons.css')
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'CSS Modules + Tachyons',
      template: 'index.html'
    })
  ]
}
```

If your local server is still running, remember to kill it and restart.

This will allow us to import directly from `tachyons` instead of needing the whole path. The `$` is for an exact match. With this config, you'd still need to add the whole filepath if you want to import from a different file within `vendors/tachyons/`. Now our `styles.css` can look squeaky clean!

```css
/* src/styles.css */
.profileCard { 
  composes: mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 from '~tachyons';
}
.profileCardBody { 
  composes: tc from '~tachyons';
}
.profileCardImage { 
  composes: br-100 h4 w4 dib ba b--black-05 pa2 from '~tachyons';
}
.profileCardTitle { 
  composes: f3 mb2 from '~tachyons';
}
.profileCardSubtitle { 
  composes: f5 fw4 gray mt0 from '~tachyons';
}
```

> The tilde ("~") prefix tells `css-loader` to look for an alias or in `node_modules` for a package.

## Dark mode

Of course, we aren't reaping the benefits of this design pattern if we don't try changing some things around. Let's change the color scheme to use a dark mode!

Let's add a background color to `html` and tweak some of the color classes.

```css{6-8,14-16,22-24}
/* src/styles.css */
html {
  background: #222;
}

.profileCard {
  composes: sans-serif mw5 center bg-near-black br3 pa3 pa4-ns mv3 ba b--white-30 shadow-5 near-white from '~tachyons';
}

.profileCardBody {
  composes: tc from '~tachyons';
}

.profileCardImage {
  composes: br-100 h4 w4 dib ba b--white-20 bg-dark-pink pa2 from '~tachyons';
}

.profileCardTitle {
  composes: f3 mb2 from '~tachyons';
}

.profileCardSubtitle {
  composes: f5 fw4 white-60 mt0 from '~tachyons';
}
```

All of the available colors are in `vendors/tachyons/_variables.css`. Play around and see what you come up with! Once you get used to the class name patterns, changing styles is effortless

## Conclusion

Things we learned:

- How to setup a webpack config for CSS Modules
- How to integrate the Tachyons library into your project
- How to compose styles
- How to use PostCSS to avoid `@import` pitfalls
- How to alias filepaths in `composes` rules

I hope this post has convinced you to try combining CSS Modules and Tachyons (or any utility-based CSS library, really) for your next project! If you have any questions/comments, drop me a line!