/**
 * bad-words-next
 *
 * @author Alex Zelensky
 * @copyright Copyright (c) 2022, Alex Zelensky. (MIT License)
 * @license MIT
 */

import { remove } from 'confusables'
import memoize from 'memoizee'

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
 * Dictionaries data map
 */
interface DataMap {
  [key: string]: Data
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
   * Special chars to allow on start and end of a word
   * @defaultValue <code>/\d|[!@#$%^&*()[\\];:'",.?\\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/</code>
   * @type {[type]}
   */
  specialChars?: RegExp

  /**
   * Pseudo space chars, a list of values for `_` symbol replacement in a dictionary word string
   * @defaultValue <code>['', '.', '-', '_', ';', '|']</code>
   */
  spaceChars?: string[]

  /**
   *  List of dictionary ids to apply transformations from [confusables](https://github.com/gc/confusables) npm package
   *  @defaultValue <code>['en', 'es', 'de']</code>
   */
  confusables?: string[]

  /**
   * Max cache items to store
   * @defaultValue 100
   * @type {[type]}
   */
  maxCacheSize?: number
}

/**
 * Required constructor options for internal store
 */
interface RequiredOptions {
  data: Data
  placeholder: string
  specialChars: RegExp
  spaceChars: string[]
  confusables: string[]
  maxCacheSize: number
}

/**
 * Internal word representation
 */
interface Word {
  id: string
  expr: string
}

/**
 * Default options object to use in BadWordsNext class contructor
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  data: {
    id: 'default',
    words: [],
    lookalike: {}
  },
  placeholder: '***',
  specialChars: /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/,
  spaceChars: ['', '.', '-', '_', ';', '|'],
  confusables: ['en', 'es', 'de'],
  maxCacheSize: 100
}

/**
 * Main library class implementing profanity filtering and detection
 */
class BadWordsNext {
  /**
   * Options object built from options passed into constructor and default options object
   * @private
   * @type {RequiredOptions}
   */
  opts: RequiredOptions

  /**
   * Special chars represented as string from specialChars regular expression
   * @private
   * @type {string}
   */
  specialChars: string

  /**
   * Words list arrived from dictionaries data
   * @private
   * @type {Word[]}
   */
  words: Word[]

  /**
   * Dictionaries data map with data ID as a key
   * @private
   * @type {DataMap}
   */
  data: DataMap

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

    this.words = []
    this.data = {}

    const memoized = memoize(this.check, { max: this.opts.maxCacheSize })
    this.check = memoized
    this.clear = memoized.clear

    this.add(this.opts.data)
  }

  /**
   * Add dictionary data for bad words filtering and detection
   *
   * @param {Data} data Dictionary data
   */
  add (data: Data): void {
    this.clear()
    this.data[data.id] = data

    for (const word of data.words) {
      let exp = word.replace(/[.?^${}()|[\]\\]/g, '\\$&').replace(/\b\*\b/, '')
      if (exp === '') continue

      if (exp.startsWith('*')) {
        exp = `[^\\s\\b^]*${exp.slice(1)}`
      }
      if (exp.endsWith('*')) {
        exp = `${exp.slice(0, -1)}[^\\s\\b$]*`
      }

      this.words.push({
        id: data.id,
        expr: exp
      })

      if (exp.includes('_')) {
        for (const ch of this.opts.spaceChars) {
          this.words.push({
            id: data.id,
            expr: exp.replace(/_/g, ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          })
        }
      }
    }
  }

  /**
   * Prepare a string by replacing dictionary lookalikes and homoglyphs
   *
   * @private
   * @param  {string} str input string
   * @param  {string} id dictionary ID
   * @return {string}
   */
  prepare (str: string, id: string): string {
    const s = str.split('').map(
      ch => this.data[id].lookalike[ch] === undefined
        ? ch
        : this.data[id].lookalike[ch]
    ).join('')

    return this.opts.confusables.includes(id) ? remove(s) : s
  }

  /**
   * Create regular expression by dictionary word expression string
   *
   * @private
   * @param  {string}
   * @return {RegExp}
   */
  regexp (expr: string): RegExp {
    return new RegExp(
      `(?:^|\\b|\\s)(?:${this.specialChars})*${expr}(?:${this.specialChars})*(?:$|\\b|\\s)`, 'i'
    )
  }

  /**
   * Check whether the input string contains bad words or not
   *
   * @param  {string}
   * @return {Boolean}
   */
  check (str: string): Boolean {
    for (const word of this.words) {
      if (this.regexp(word.expr).test(str) || this.regexp(word.expr).test(this.prepare(str, word.id))) {
        return true
      }
    }
    return false
  }

  /**
   * Filter bad words in the input string and replace them with a placeholder
   *
   * @param  {string}
   * @return {string}
   */
  filter (str: string): string {
    if (str === '' || this.check(str) === false) return str

    const delims: string[] = []
    const re = /([\b\s])/g

    let match
    while ((match = re.exec(str)) !== null) {
      delims.push(match[0])
    }

    return str.split(/[\b\s]/).map(
      p => this.check(p) === true ? this.opts.placeholder : p
    ).reduce((a, s, i) => (a + (i > 0 ? delims[i - 1] === undefined ? ' ' : delims[i - 1] : '') + s), '')
  }
}

export default BadWordsNext
