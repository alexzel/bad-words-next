'use strict'

const { Bench } = require('tinybench')

const BadWords = require('bad-words')
const leo = require('leo-profanity')

const BadWordsNext = require('../')
const en = require('../data/en.json')

const badwords = new BadWords()
const badwordsNext = new BadWordsNext({ data: en })

let counter = 0
const run = str => {
  const bench = new Bench({ time: 100 })

  bench
    .add('BadWordsNext:check', () => {
      badwordsNext.check(str)
    })
    .add('LeoProfanity:check', () => {
      leo.check(str)
    })
    .add('BadWords:check', () => {
      badwords.isProfane(str)
    })

    .add('BadWordsNext:filter', () => {
      badwordsNext.filter(str)
    })
    .add('LeoProfanity:filter', () => {
      leo.clean(str)
    })
    .add('BadWords:filter', () => {
      badwords.clean(str)
    })

    .run()
    .then(() => {
      console.log('\x1b[34m%s\x1b[0m', `Run #${++counter}`)
      console.log()
      console.log('\x1b[32m%s\x1b[0m', 'Input string:')
      console.log()
      console.log(str)
      console.log()
      console.log('\x1b[32m%s\x1b[0m', 'Benchmark results:')
      console.log()
      console.table(bench.tasks.map(({ name, result = {} }) =>
        ({ 'Task Name': name, 'Average Time (ps)': (result.mean || 0) * 1000, 'Variance (ps)': (result.variance || 0) * 1000 })))
      console.log()
      console.log('\x1b[32m%s\x1b[0m', 'Check results:')
      console.log()
      console.log('BadWordsNext:check', badwordsNext.check(str))
      console.log('LeoProfanity:check', leo.check(str))
      console.log('BadWords:check', badwords.isProfane(str))
      console.log()
    })
    .catch(e => {
      console.error(e)
    })
}

run('Test word sex here and many words in this string as well as many possibilities to check and filter. We test this string and get some results.')
run('S0me sh!tt is here. just\t $hittt \n   and \ng0 \n@$hol b00bs and d1cks \n end')
run(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel dolor at felis tempor euismod. Integer ac dictum lorem, quis malesuada enim. Ut at lacinia nibh, vitae faucibus lectus. Morbi efficitur sodales eros et hendrerit. Praesent porttitor fringilla nunc, nec malesuada nisl faucibus sit amet. Cras leo est, finibus quis ligula sed, lacinia feugiat tortor. Suspendisse pulvinar dui massa, id pulvinar sapien porta vitae.

Morbi mollis sapien at justo hendrerit, non ullamcorper dui vehicula. Praesent venenatis tellus a ante laoreet egestas sit amet non nibh. Suspendisse commodo malesuada leo sit amet pharetra. Aliquam sed interdum est, id hendrerit ante. Vestibulum quis leo id leo viverra ultricies. Quisque eu accumsan nisl, cursus mollis ipsum. Sed tincidunt eleifend sem, eu dignissim quam accumsan vitae. Ut cursus enim eu porta maximus. Nullam eget purus convallis, commodo mauris nec, dapibus ante. Interdum et malesuada fames ac ante ipsum primis in faucibus.

Praesent at interdum orci. Vestibulum ligula velit, imperdiet non convallis in, placerat sit amet lorem. Nullam posuere enim et lectus vulputate, vel rhoncus ipsum posuere. In nec viverra turpis. Ut tempus nibh ac bibendum dapibus. Aenean efficitur, dui rutrum vestibulum suscipit, magna velit interdum odio, vitae tempor lectus nisi eu ex. In bibendum porttitor placerat. Vestibulum vestibulum vulputate justo eget congue. Pellentesque ut augue et augue fermentum hendrerit vel et ante. Donec ex mi, mattis vitae turpis at, posuere aliquam erat. Proin tincidunt elit et velit venenatis accumsan.

Fusce eu venenatis lorem. Phasellus ligula lorem, scelerisque in interdum nec, aliquam vitae orci. Duis in ullamcorper erat, non placerat justo. Nunc fringilla metus felis, eget volutpat urna sodales vitae. In semper bibendum lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas in leo sit amet turpis venenatis venenatis quis sed sapien. Fusce quis sollicitudin purus. Etiam ac mi ultrices sapien efficitur condimentum in dictum ante. Praesent eros sapien, ornare eget tellus at, malesuada varius massa. Nunc egestas ex est. Vestibulum eget lorem libero. Aliquam nec est eu nunc porttitor iaculis. Morbi erat ex, tristique a vestibulum nec, convallis ac nulla. Quisque vel quam iaculis, fringilla purus vel, euismod dui. Phasellus efficitur, odio non feugiat fermentum, purus dolor scelerisque eros, et tincidunt magna ante at sapien.

In venenatis fringilla nulla, quis dignissim dolor tempus tempus. Nunc vel justo convallis, fringilla libero sit amet, molestie magna. In at condimentum dolor, quis viverra augue. Praesent scelerisque, justo vel dictum pretium, urna massa porttitor nulla, vel condimentum nisi nisl vel augue. Quisque in nibh in lectus condimentum ultricies id eu velit. Phasellus tempor scelerisque libero rutrum placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur luctus sodales justo sit amet vulputate. Curabitur venenatis arcu risus, non commodo orci viverra non. Praesent congue, diam ac aliquam vehicula, libero ligula posuere orci, vel feugiat leo nulla nec purus. Curabitur efficitur nunc erat, in elementum purus elementum eget.`)
