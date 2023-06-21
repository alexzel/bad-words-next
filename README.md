# bad-words-next

![workflows-nodejs-ci](https://github.com/alexzel/bad-words-next/actions/workflows/node-ci.yml/badge.svg?branch=main)
![npm version](https://img.shields.io/npm/v/bad-words-next)
![NPM license](https://img.shields.io/npm/l/bad-words-next)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/bad-words-next)
![npm downloads](https://img.shields.io/npm/dm/bad-words-next)

JavaScript/TypeScript filter and checker for bad words aka profanity.

API documentation in [GitHub Wiki](https://github.com/alexzel/bad-words-next/wiki/BadWordsNext).

## Install

```sh
yarn add bad-words-next
```

or

```sh
npm install bad-words-next
```

## Basic usage

```js
const BadWordsNext = require('bad-words-next')
const en = require('bad-words-next/data/en.json')

const badwords = new BadWordsNext({ data: en })

// Returns true when passed string contains a bad word
console.log(badwords.check('S0me sh!tt is here'))
// will print `true`

// Returns filtered string with masked bad words
console.log(badwords.filter('S0me sh!tt is here'))
// will print `S0me *** is here`

// Returns filtered string and catches bad words
badwords.filter('S0me sh!tt is here', badword => {
  console.log(badword)
})
// will print `sh!tt`
```

## Add more dictionaries

```js
const BadWordsNext = require('bad-words-next')

const en = require('bad-words-next/data/en.json')
const es = require('bad-words-next/data/es.json')
const fr = require('bad-words-next/data/fr.json')
const de = require('bad-words-next/data/de.json')
const ru = require('bad-words-next/data/ru.json')
const rl = require('bad-words-next/data/ru_lat.json')
const ua = require('bad-words-next/data/ua.json')
const pl = require('bad-words-next/data/pl.json')
const ch = require('bad-words-next/data/ch.json')

const badwords = new BadWordsNext()
badwords.add(en)
badwords.add(es)
badwords.add(fr)
badwords.add(de)
badwords.add(ru)
badwords.add(rl)
badwords.add(ua)
badwords.add(pl)
badwords.add(ch)
```

## Dictionary files format

```ts
interface Data {
  id: string  // Unique dictionary ID
  words: string[] // Words list
  lookalike: Lookalike // Lookalike homoglyphs map
}

type Lookalike = Record<string | number, string> // Simple key-value object
```

You can use the following pattern characters in a word string:

- `*` indicates any characters, use it only on start and/or end of a word
- `+` indicates one or more repeating characters
- `_` indicates special characters

## Options

```ts
interface Options {
  data?: Data // Dictionary data
  placeholder?: string // Filter placeholder - default '***'
  placeholderMode?: 'repeat' | 'replace' // Placeholder mode to either replace with or repeat the placeholder - default 'replace'
  specialChars?: RegExp // Special chars to allow on start and/or end of a word - default /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/
  spaceChars?: string[] // Pseudo space chars, a list of values for `_` symbol in a dictionary word string - default ['', '.', '-', ';', '|']
  confusables?: string[] // List of ids to apply transformations from `confusables` npm package - default ['en', 'es', 'de', 'ru_lat']
  maxCacheSize?: number // Max items to store in cache - default 100
}
```

See [Options API](https://github.com/alexzel/bad-words-next/wiki/Options) for more details.

## Notes

- Dictionary words with spaces won't work b/c they do not represent a single word

- Dictionaries have to be improved over time
