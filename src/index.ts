import { remove } from 'confusables'
import moize from 'moize'

/**
 * @license bad-words-next
 * Copyright (c) 2022, Alex Zelensky. (MIT License)
 * https://github.com/alexzel/bad-words-next
 */

function escapeRegexpWord (word: string): string {
  return word.replace(/[.?^${}()|[\]\\]/g, '\\$&').replace(/\b\*\b/, '')
}

function escapeRegexpString (str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Simple key-value object for homoglyphs conversion
 */
export interface Lookalike {
  [key: string | number]: string
}

/**
 * Dictionary data format
 */
export interface Data {
  /**
   * Unique dictionary ID
   * @type {string}
   */
  id: string

  /**
   * Words list
   * @type {string[]}
   */
  words: string[]

  /**
   * Lookalike homoglyphs map
   * @type {Lookalike}
   */
  lookalike: Lookalike
}

/**
 * Constructor options
 */
export interface Options {
  /**
   * Dictionary data
   * @type {[type]}
   */
  data?: Data

  /**
   * Filter placeholder
   * @defaultValue <code>'***'</code>
   * @type {[type]}
   */
  placeholder?: string

  /**
   * Special chars to allow on start and/or end of a word
   * @defaultValue <code>/\d|[!@#$%^&*()[\\];:'",.?\\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/</code>
   * @type {[type]}
   */
  specialChars?: RegExp

  /**
   * Pseudo space chars, a list of values for `_` symbol replacement in a dictionary word string
   * @defaultValue <code>['', '.', '-', ';', '|']</code>
   */
  spaceChars?: string[]

  /**
   *  List of dictionary ids to apply transformations from [confusables](https://github.com/gc/confusables) npm package
   *  @defaultValue <code>['en', 'es', 'de', 'ru_lat']</code>
   */
  confusables?: string[]

  /**
   * Max items to store in cache
   * @defaultValue 100
   * @type {[type]}
   */
  maxCacheSize?: number
}

/**
 * Internal options with required properties
 */
interface InternalOptions {
  data?: Data
  placeholder: string
  specialChars: RegExp
  spaceChars: string[]
  confusables: string[]
  maxCacheSize: number
}

/**
 * Internal dictionaries data format
 */
interface InternalData extends Data {
  /**
   * Regular expression for dictionary words
   * @type {RegExp}
   */
  wordsRegexp: RegExp

  /**
   * Regular expression for lookalikes
   * @type {RegExp}
   */
  lookalikeRegexp?: RegExp
}

/**
 * Internal dictionaries data map
 */
interface InternalDataMap {
  [key: string]: InternalData
}

/**
 * Default options object to use in BadWordsNext class contructor
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  placeholder: '***',
  specialChars: /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/,
  spaceChars: ['', '.', '-', ';', '|'],
  confusables: ['en', 'es', 'de', 'ru_lat'],
  maxCacheSize: 100
}

/**
 * Main library class implementing profanity filtering and detection
 */
class BadWordsNext {
  /**
   * Options object built from options passed into constructor and default options object
   * @private
   * @type {InternalOptions}
   */
  opts: InternalOptions

  /**
   * Special chars represented as a string from specialChars regular expression
   * @private
   * @type {string}
   */
  specialChars: string

  /**
   * Dictionaries ids list
   * @private
   * @type {string[]}
   */
  ids: string[]

  /**
   * Dictionaries data map with data ID as a key
   * @private
   * @type {DataMap}
   */
  data: InternalDataMap

  /**
   * Clear memoized check
   * @private
   * @type {Function}
   */
  clear: Function

  /**
   * Create an instance of BadWordsNext class
   *
   * @param {Options}
   */
  constructor (opts?: Options) {
    this.opts = opts !== undefined
      ? { ...DEFAULT_OPTIONS, ...opts }
      : DEFAULT_OPTIONS

    this.specialChars = this.opts.specialChars.toString().slice(1, -1)
    this.data = {}
    this.ids = []

    const memoized = moize(this.check, { maxSize: this.opts.maxCacheSize })
    this.check = memoized
    this.clear = memoized.clear

    if (this.opts.data !== undefined) {
      this.add(this.opts.data)
    }
  }

  /**
   * Add dictionary data for bad words filtering and detection
   *
   * @param {Data} data Dictionary data
   */
  add (data: Data): void {
    this.clear()

    let regexp = ''
    let lookalike = ''

    for (const word of data.words) {
      let exp = escapeRegexpWord(word)
      if (exp === '') continue

      if (exp.startsWith('*')) {
        exp = `[^\\s\\b^]*${exp.slice(1)}`
      }
      if (exp.endsWith('*')) {
        exp = `${exp.slice(0, -1)}[^\\s\\b$]*`
      }

      regexp += regexp !== '' ? `|${exp}` : exp

      if (exp.includes('_')) {
        for (const ch of this.opts.spaceChars) {
          regexp += `|${exp.replace(/_/g, escapeRegexpString(ch))}`
        }
      }
    }

    for (const key in data.lookalike) {
      const esc = escapeRegexpString(key)
      lookalike += lookalike !== '' ? `|${esc}` : esc
    }

    this.data[data.id] = {
      ...data,
      wordsRegexp: this.regexp(regexp)
    }

    if (lookalike !== '') {
      this.data[data.id].lookalikeRegexp = new RegExp(lookalike, 'ig')
    }

    this.ids.push(data.id)
  }

  /**
   * Prepare a string by replacing dictionary lookalikes and confusables
   *
   * @private
   * @param  {string} str input string
   * @param  {string} id dictionary ID
   * @return {string}
   */
  prepare (str: string, id: string): string {
    let s = str

    if (this.data[id].lookalikeRegexp !== undefined) {
      s = str.replace(this.data[id].lookalikeRegexp as RegExp, (m) => {
        if (this.data[id].lookalike[m] !== undefined) {
          return this.data[id].lookalike[m]
        }

        const ml = m.toLowerCase()
        if (this.data[id].lookalike[ml] !== undefined) {
          return this.data[id].lookalike[ml]
        }

        return m
      })
    }

    return this.opts.confusables.includes(id) ? remove(s) : s
  }

  /**
   * Create regular expression by dictionary expression string
   *
   * @private
   * @param  {string}
   * @return {RegExp}
   */
  regexp (expr: string): RegExp {
    return new RegExp(
      `(?:^|\\b|\\s)(?:${this.specialChars})*(?:${expr})(?:${this.specialChars})*(?:$|\\b|\\s)`, 'i'
    )
  }

  /**
   * Check whether the input string contains bad words or not
   *
   * @param  {string}
   * @return {Boolean}
   */
  check (str: string): Boolean {
    for (const id of this.ids) {
      if (this.data[id].wordsRegexp.test(str) || this.data[id].wordsRegexp.test(this.prepare(str, id))) {
        return true
      }
    }
    return false
  }

  /**
   * Filter bad words in the input string and replace them with a placeholder
   *
   * @param  {string}
   * @param  {(badword: string) => void}
   * @return {string}
   */
  filter (str: string, onCatch?: (badword: string) => void): string {
    if (str === '' || this.check(str) === false) return str

    const delims: string[] = []
    const re = /([\b\s])/g

    let match
    while ((match = re.exec(str)) !== null) {
      delims.push(match[0])
    }

    return str
      .split(/[\b\s]/)
      .map(word => {
        if (this.check(word) === true) {
          if (onCatch !== undefined) {
            onCatch(word)
          }
          return this.opts.placeholder
        }
        return word
      })
      .reduce((acc, word, i) => {
        return acc +
          (i > 0
            ? delims[i - 1] === undefined
              ? ' '
              : delims[i - 1]
            : '') +
          word
      }, '')
  }
}

export default BadWordsNext
