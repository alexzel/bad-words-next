'use strict'

const { Bench } = require('tinybench')

const BadWords = require('bad-words')
const leo = require('leo-profanity')

const BadWordsNext = require('../')
const en = require('../data/en.json')

const bench = new Bench({ time: 100 })

const badwordsNext = new BadWordsNext({ data: en })
const badwords = new BadWords()

const BAD = 'S0me sh!tt is here. just\t $hittt \n   and \ng0 \n@$hol b00bs and d1cks \n end'

bench
  .add('BadWordsNext:check', () => {
    badwordsNext.check(BAD)
  })
  .add('LeoProfanity:check', () => {
    leo.check(BAD)
  })
  .add('BadWords:check', () => {
    badwords.isProfane(BAD)
  })
  
  .add('BadWordsNext:filter', () => {
    badwordsNext.filter(BAD)
  })
  .add('LeoProfanity:filter', () => {
    leo.clean(BAD)
  })
  .add('BadWords:filter', () => {
    badwords.clean(BAD)
  })
  
  .run()
  .then(() => {
    console.table(bench.tasks.map(({ name, result = {} }) =>
      ({ "Task Name": name, "Average Time (ps)": (result.mean || 0) * 1000, "Variance (ps)": (result.variance || 0) * 1000 })));
  })
  .catch(e => {
    console.error(e)
  })
