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
export type Lookalike = Record<string | number, string>

/**
 * Placeholder mode to either replace with or repeat the placeholder
 * @type {String}
 */
export type PlaceholderMode = 'repeat' | 'replace'

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
   * Placeholder mode to either replace with or repeat the placeholder
   * @defaultValue <code>'replace'</code>
   * @type {[type]}
   */
  placeholderMode?: PlaceholderMode

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
   * Max items to store in the internal cache
   * @defaultValue 100
   * @type {[type]}
   */
  maxCacheSize?: number

  /**
   * The list of exclusions
   */
  exclusions?: string[]
}

/**
 * Internal options with required properties
 */
interface InternalOptions {
  data?: Data
  placeholder: string
  placeholderMode: PlaceholderMode
  specialChars: RegExp
  spaceChars: string[]
  confusables: string[]
  maxCacheSize: number
  exclusions: string[]
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
type InternalDataMap = Record<string, InternalData>

/**
 * Default options object to use in BadWordsNext class contructor
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  placeholder: '***',
  placeholderMode: 'replace' as const,
  specialChars: /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/,
  spaceChars: ['', '.', '-', ';', '|'],
  confusables: ['en', 'es', 'de', 'ru_lat'],
  maxCacheSize: 100,
  exclusions: []
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
   * Prepared regexps for exclusions
   * @private
   * @type {RegExp[]}
   */
  exclusionsRegexps: RegExp[]

  /**
   * Dictionaries ids list
   * @private
   * @type {string[]}
   */
  ids: string[]

  /**
   * Dictionaries data map with data ID as a key
   * @private
   * @type {InternalDataMap}
   */
  data: InternalDataMap

  /**
   * Clear memoized check
   * @private
   * @type {() => void}
   */
  clear: () => void

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
    this.exclusionsRegexps = this.opts.exclusions.map<RegExp>(this.regexp.bind(this))
    this.data = {}
    this.ids = []

    // maxCacheSize is distributed between check and preCheck functions
    // in theory preCheck contains less items so we give it one third of maxCacheSize
    const preCheckMaxCacheSize = Math.max(0, Math.floor(this.opts.maxCacheSize / 3))

    const moizedPreCheck = moize(this.preCheck, { maxSize: preCheckMaxCacheSize })
    this.preCheck = moizedPreCheck

    const moizedCheck = moize(this.check, { maxSize: this.opts.maxCacheSize - preCheckMaxCacheSize })
    this.check = moizedCheck

    this.clear = () => {
      moizedPreCheck.clear()
      moizedCheck.clear()
    }

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
   * Create new regular expression by dictionary expression string
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
   * Check whether the input string contains bad words or not.
   * Note: it does not take into account the exclusions list.
   *
   * @private
   * @param {string} str
   * @return {boolean}
   */
  preCheck (str: string): boolean {
    for (const id of this.ids) {
      if (this.data[id].wordsRegexp.test(str) || this.data[id].wordsRegexp.test(this.prepare(str, id))) {
        return true
      }
    }
    return false
  }

  /**
   * Check whether the particular word is bad or not
   *
   * @param {string} word
   * @return {boolean}
   */
  check (word: string): boolean {
    for (const id of this.ids) {
      // We calculate prepared word only once and only when it's needed
      let preparedWord: string | null = null

      // Check exclusions
      for (const exclusionRegexp of this.exclusionsRegexps) {
        if (exclusionRegexp.test(word)) {
          return false
        }
        if (preparedWord === null) {
          preparedWord = this.prepare(word, id)
        }
        if (exclusionRegexp.test(preparedWord)) {
          return false
        }
      }

      // Check bad words
      if (this.data[id].wordsRegexp.test(word)) {
        return true
      }
      if (preparedWord === null) {
        preparedWord = this.prepare(word, id)
      }
      if (this.data[id].wordsRegexp.test(preparedWord)) {
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
    if (str === '' || !this.preCheck(str)) return str

    const delims: string[] = []
    const re = /([\b\s])/g

    let match
    while ((match = re.exec(str)) !== null) {
      delims.push(match[0])
    }

    const repeat = this.opts.placeholderMode === 'repeat'

    return str
      .split(/[\b\s]/)
      .map(word => {
        if (this.check(word)) {
          if (onCatch !== undefined) {
            onCatch(word)
          }
          if (repeat) {
            return this.opts.placeholder.repeat(
              // FIX: This should work with multi-byte utf8 chars
              // See: skipped test for multi-byte utf8 chars
              //
              // There is a suggestion to use regexp and split
              // See: https://gist.github.com/galdolber/1568e767fe69f9439874cc20c755b80e
              //  word.split(/(\P{Mark}\p{Mark}*)/u).filter(Boolean).length
              //
              // But babel polyfills produce really large output for that regexp.
              word.length
            )
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
