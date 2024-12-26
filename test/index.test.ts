import BadWordsNext from '../src'
import { dt } from '../src/decode'

import en from '../src/en'
import ru from '../src/ru'
import rl from '../src/ru_lat'
import ua from '../src/ua'
import es from '../src/es'
import ch from '../src/ch'
import fr from '../src/fr'
import pl from '../src/pl'
import de from '../src/de'

// NOTE: All profane strings are encoded to hex either in shell like this:
// echo -n "test" | hexdump -v -e '/1 "%02X "' | tr -d ' '
// or in Node.js like this:
// Array.from(new TextEncoder().encode('test')).map(b => b.toString(16).padStart(2, '0')).join('')

describe('index', () => {
  describe('default', () => {
    it('creates new instance without options', () => {
      const badwords = new BadWordsNext()
      expect(badwords).toHaveProperty('opts')
      expect(badwords).not.toHaveProperty('opts.data')
      expect(badwords).toHaveProperty('opts.placeholder')
      expect(badwords).toHaveProperty('opts.specialChars')
      expect(badwords).toHaveProperty('opts.spaceChars')
      expect(badwords).toHaveProperty('opts.confusables')
      expect(badwords).toHaveProperty('opts.maxCacheSize')
      expect(badwords).toHaveProperty('opts.exclusions')
    })

    it('creates new instance with default options', () => {
      const badwords = new BadWordsNext({ data: en })
      expect(badwords).toHaveProperty('opts')
      expect(badwords).toHaveProperty('opts.data')
      expect(badwords).toHaveProperty('opts.placeholder')
      expect(badwords).toHaveProperty('opts.specialChars')
      expect(badwords).toHaveProperty('opts.spaceChars')
      expect(badwords).toHaveProperty('opts.confusables')
      expect(badwords).toHaveProperty('opts.maxCacheSize')
      expect(badwords).toHaveProperty('opts.exclusions')
    })

    describe('add()', () => {
      it('adds new data', () => {
        const badwords = new BadWordsNext()
        const input = dt('736578')
        expect(badwords.check(input)).toBeFalsy()
        badwords.add(en)
        expect(badwords.check(input)).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('preserves word boundaries', () => {
        const badwords = new BadWordsNext({ data: en })
        const input = dt('6a7573740920246869747474200a202020616e64200a6730200a4024686f6c20')
        expect(badwords.filter(input)).toBe('just\t *** \n   and \ng0 \n*** ')
      })

      it('filters with custom placeholder', () => {
        const badwords = new BadWordsNext({ data: en, placeholder: '#' })
        const input = dt('736578')
        expect(badwords.filter(input)).toBe('#')
      })

      it('filters and reports back with callback function', () => {
        const badwords = new BadWordsNext({ data: en })
        const input = dt('68656c6c6f207365782073657833206230303030622074657374206230306220616e796675636b616e7920707573737920636174')
        const detected: string[] = []
        badwords.filter(input, (word: string) => detected.push(word))
        expect(detected).toStrictEqual([
          dt('736578'),
          dt('73657833'),
          dt('623030303062'),
          dt('62303062'),
          dt('616e796675636b616e79'),
          dt('7075737379')
        ])
      })

      it('filters and replaces with repeated placeholder', () => {
        const badwords = new BadWordsNext({ data: en, placeholder: '#', placeholderMode: 'repeat' })
        const input = dt('246831747474')
        expect(badwords.filter(input)).toBe('######')
      })

      it.skip('filters and replaces with repeated placeholder multi-byte utf8 chars', () => {
        const badwords = new BadWordsNext({
          data: {
            id: 'test',
            words: ['𓆲', '𐐷', 'אֵ֗', 'ó', 'ὀ', 'е́'],
            lookalike: {}
          },
          placeholder: '*',
          placeholderMode: 'repeat'
        })
        expect(badwords.filter('𓆲')).toBe('*')
        expect(badwords.filter('𐐷')).toBe('*')
        expect(badwords.filter('אֵ֗')).toBe('*')
        expect(badwords.filter('е́')).toBe('*')
        expect(badwords.filter('ó')).toBe('*')
        expect(badwords.filter('ὀ')).toBe('*')
      })

      it('filters an empty string', () => {
        const badwords = new BadWordsNext({ data: en })
        expect(badwords.filter('')).toBe('')
      })

      it('filters with exclusions', () => {
        const data = { ...en, words: [...en.words, 'b@d'] }
        const input = dt('7365783a2073657879206d616c65207368317420eaaeaaf09d909ef09d948120eaaeaaf09d909ef09d9481792073656d656e2024656d656e2062406420626164')

        let badwords = new BadWordsNext({ data })
        expect(badwords.filter(input)).toBe('*** *** male *** *** *** *** *** *** bad')

        badwords = new BadWordsNext({ data, exclusions: [dt('736578'), dt('73656d656e'), 'b@*'] })
        expect(badwords.filter(input)).toBe(dt('7365783a202a2a2a206d616c65202a2a2a20eaaeaaf09d909ef09d9481202a2a2a2073656d656e2024656d656e2062406420626164'))
      })

      it('filters with exclusions containing lookalikes', () => {
        const badwords1 = new BadWordsNext({ data: en })
        const input = dt('736868686831742b2b2068617070656e73')
        expect(badwords1.filter(input)).toBe('*** happens')

        const badwords2 = new BadWordsNext({ data: en, exclusions: [dt('73682b69742b')] })
        expect(badwords2.filter(input)).toBe(input)
      })

      it('calls only preCheck when there are no bad words', () => {
        const badwords = new BadWordsNext({ data: en })

        const spyCheck = jest.spyOn(badwords, 'check')
        const spyPreCheck = jest.spyOn(badwords, 'preCheck')

        badwords.filter('A text without badwords')

        expect(spyPreCheck).toBeCalledTimes(1)
        expect(spyCheck).toBeCalledTimes(0)
      })

      it('trims dictionary words and replaces spaces with pseudo space chars', () => {
        const badwords = new BadWordsNext({
          data: { id: 'test', words: ['  t est*   '], lookalike: {} }
        })
        expect(badwords.check('test')).toBeTruthy()
        expect(badwords.check('t.est')).toBeTruthy()
        expect(badwords.check('t-esting')).toBeTruthy()
        expect(badwords.check('123t-esting')).toBeTruthy() // with a special chars at the beginning of a word
        expect(badwords.check('zt-esting')).toBeFalsy()
      })

      it('converts special chars regexp into internal string', () => {
        const badwords1 = new BadWordsNext({ specialChars: /^\d|(?:extra)|\$$/igm })
        expect(badwords1.specialChars).toBe('\\d|(?:extra)|\\$')

        const badwords2 = new BadWordsNext({ specialChars: /a/ })
        expect(badwords2.specialChars).toBe('a')
      })
    })
  })

  describe('en', () => {
    const badwords = new BadWordsNext({ data: en })

    describe('check()', () => {
      it('checks subwords', () => {
        expect(badwords.check(dt('616e796675636b616e79'))).toBeTruthy()
      })

      it('checks an empty string', () => {
        expect(badwords.check('')).toBeFalsy()
      })

      it('checks words at start', () => {
        expect(badwords.check(dt('6d617374757262617465'))).toBeTruthy()
      })

      it('checks whole words', () => {
        expect(badwords.check(dt('686f7265'))).toBeTruthy()
      })

      it('checks words in sentence', () => {
        expect(badwords.check(dt('736d616c6c207469747469657320617265206772656174'))).toBeTruthy()
      })

      it('checks words with special chars boundary', () => {
        expect(badwords.check(dt('2121686f72652929'))).toBeTruthy()
      })

      it('checks words with repeating chars', () => {
        expect(badwords.check(dt('626f6f6f6f62'))).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check(dt('38303030303062'))).toBeTruthy()
        expect(badwords.check(dt('7368212b'))).toBeTruthy()
        expect(badwords.check(dt('246578'))).toBeTruthy()
      })

      it('checks words with special space chars', () => {
        expect(badwords.check(dt('626c6f772d6a6f62'))).toBeTruthy()
        expect(badwords.check(dt('626c6f775f6a6f62'))).toBeTruthy()
        expect(badwords.check(dt('626c6f772e6a6f62'))).toBeTruthy()
        expect(badwords.check(dt('626c6f776a6f62'))).toBeTruthy()
      })

      it('checks confusables', () => {
        expect(badwords.check(dt('eaaeaaf09d909ef09d9481'))).toBeTruthy()
      })

      it('checks words with good chars', () => {
        expect(badwords.check('cat')).toBeFalsy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        const input = dt('68656c6c6f207365782073657833206230303030622074657374206230306220616e796675636b616e7920707573737920636174')
        expect(badwords.filter(input)).toBe('hello *** *** *** test *** *** *** cat')
      })

      it('filters bad words with spaces', () => {
        const input = dt('736565202020636f636b2d2475636b696e67206640746675636b6572732040726f756e64')
        expect(badwords.filter(input)).toBe('see   *** *** @round')
      })
    })
  })

  describe('ru', () => {
    const badwords = new BadWordsNext({ data: ru })

    describe('check()', () => {
      it('checks subwords', () => {
        expect(badwords.check(dt('d0b7d0b0d0b5d0b1d0b0d182d0b5d0bdd18cd0bad0be'))).toBeTruthy()
      })

      it('checks whole words', () => {
        expect(badwords.check(dt('d0b5d0b1'))).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check(dt('4840d185d183d0b941'))).toBeTruthy()
        expect(badwords.check(dt('43f09f8688d0baf09f87a621'))).toBeTruthy()
      })

      it('checks words with good chars', () => {
        expect(badwords.check('кот')).toBeFalsy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('d0bad182d0be20d182d18b20d1815934d0ba402036d0bbd18fd182d18c20d0b03f'))).toBe('кто ты *** *** а?')
      })
    })
  })

  describe('ru_lat', () => {
    const badwords = new BadWordsNext({ data: rl })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('7a616c757061'))).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check(dt('33406c755061'))).toBeTruthy()
      })

      it('checks confusables', () => {
        expect(badwords.check(dt('f09d9481f09f868875'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('65746f7420706964617220687579'))).toBe('etot *** ***')
      })
    })
  })

  describe('ua', () => {
    const badwords = new BadWordsNext({ data: ua })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('d182d0be20d19420d0bfd0b0d0b4d0bbd18ed0bad0b020d182d0b0d0bad0b020d0bcd0b0d0bbd0b0'))).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check(dt('d0bff09f85b833d0b4f09f87a6d182d0be'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('d182d0be20d19420d0b4d183d0bfd0b020d0b9d0bed0bbd0bed0bfd0b0'))).toBe('то є *** ***')
      })
    })
  })

  describe('es', () => {
    const badwords = new BadWordsNext({ data: es })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('4d7563686f206a696c69706f6c6c6173'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('456c2043616272c3b36e2079204c612050757461'))).toBe('El *** y La ***')
      })
    })
  })

  describe('ch', () => {
    const badwords = new BadWordsNext({ data: ch })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('e5b9b9e4bda0e5a898'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('e5b9b9e4bda0e5a89820e5a693e5a5b3'))).toBe('*** ***')
      })
    })
  })

  describe('fr', () => {
    const badwords = new BadWordsNext({ data: fr })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('636f6e6e617264'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('c3a974726f6e'))).toBe('***')
      })
    })
  })

  describe('pl', () => {
    const badwords = new BadWordsNext({ data: pl })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('64757061206b75727779'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('64757061206b75727779'))).toBe('*** ***')
      })
    })
  })

  describe('de', () => {
    const badwords = new BadWordsNext({ data: de })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check(dt('646965207363686569c39f65'))).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter(dt('496368206b61636b65207365687220677574'))).toBe('Ich *** sehr gut')
      })
    })
  })
})
