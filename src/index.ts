/**
 * @license bad-words-next
 * Copyright (c) 2022, Alex Zelensky. (MIT License)
 * https://github.com/alexzel/bad-words-next
 */

import { remove } from 'confusables'

interface Lookalike {
  [key: string | number]: string
}

interface Data {
  id: string
  words: string[]
  lookalike: Lookalike
}

interface DataMap {
  [key: string]: Data
}

interface Options {
  data?: Data
  placeholder?: string
  specialChars?: RegExp
  spaceChars?: string[]
  confusables?: string[]
}

interface RequiredOptions {
  data: Data
  placeholder: string
  specialChars: RegExp
  spaceChars: string[]
  confusables: string[]
}

interface Word {
  id: string
  expr: string
}

// TODO: implement excludes?
const DEFAULT_OPTIONS = {
  data: {
    id: 'default',
    words: [],
    lookalike: {}
  },
  placeholder: '***',
  specialChars: /\d|[!@#$%^&*()[\];:'",.?\-_=+~`|]|a|(?:the)|(?:el)|(?:la)/,
  spaceChars: ['', '.', '-', '_', ';', '|'],
  confusables: ['en', 'es', 'de']
}

class BadWordsNext {
  opts: RequiredOptions
  specialChars: string

  words: Word[]
  data: DataMap

  constructor (opts?: Options) {
    this.opts = opts !== undefined
      ? { ...DEFAULT_OPTIONS, ...opts }
      : DEFAULT_OPTIONS

    this.specialChars = this.opts.specialChars.toString().slice(1, -1)

    this.words = []
    this.data = {}

    this.add(this.opts.data)
  }

  add (data: Data): void {
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

  prepare (str: string, id: string): string {
    const s = str.split('').map(
      ch => this.data[id].lookalike[ch] === undefined
        ? ch
        : this.data[id].lookalike[ch]
    ).join('')

    return this.opts.confusables.includes(id) ? remove(s) : s
  }

  regexp (expr: string): RegExp {
    return new RegExp(
      `(?:^|\\b|\\s)(?:${this.specialChars})*${expr}(?:${this.specialChars})*(?:$|\\b|\\s)`, 'i'
    )
  }

  check (str: string): Boolean {
    for (const word of this.words) {
      if (this.regexp(word.expr).test(str) || this.regexp(word.expr).test(this.prepare(str, word.id))) {
        return true
      }
    }
    return false
  }

  filter (str: string): string {
    if (str === '' || this.check(str) === false) return str
    return str.split(/[\b\s]/).map(
      p => this.check(p) === true ? this.opts.placeholder : p
    ).join(' ')
  }
}

export default BadWordsNext
