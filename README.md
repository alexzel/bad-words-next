# bad-words-next

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
```

## Add more dictionaries

```sh
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
  id: string  // unique ID
  words: string[] // words list, supports `*` on start and end of a string to indicate any characters, also `+` for one or more repeating characters, and `_` for special characters.
  lookalike: Lookalike // map for homoglyphs conversion
}

interface Lookalike {
  [key: string | number]: string // just a simple key-value object
}
```

## Options

```ts
interface Options {
  data?: Data // Dictionary data
  placeholder?: string // Filter placeholder - default value '***'
  specialChars?: RegExp // Special chars to allow on word start and word end - default value /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/
  spaceChars?: string[] // Pseudo space chars, a list of values for `_` symbol in a dictionary word string - default value ['', '.', '-', ';', '|']
  confusables?: string[] // List of ids to apply transformations from `confusables` npm package - default ['en', 'es', 'de']
  maxCacheSize?: number // Max items to store in cache - default value 100
}
```

## Notes

- Dictionary words with spaces won't work b/c they do not represent a single word

- Dictionaries have to be improved over time
