import BadWordsNext from '../src'
import en from '../src/en'
import ru from '../src/ru'
import rl from '../src/ru_lat'
import ua from '../src/ua'
import es from '../src/es'
import ch from '../src/ch'
import fr from '../src/fr'
import pl from '../src/pl'
import de from '../src/de'

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
        expect(badwords.check('sex')).toBeFalsy()
        badwords.add(en)
        expect(badwords.check('sex')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('preserves word boundaries', () => {
        const badwords = new BadWordsNext({ data: en })
        expect(badwords.filter('just\t $hittt \n   and \ng0 \n@$hol ')).toBe('just\t *** \n   and \ng0 \n*** ')
      })

      it('filters with custom placeholder', () => {
        const badwords = new BadWordsNext({ data: en, placeholder: '#' })
        expect(badwords.filter('sex')).toBe('#')
      })

      it('filters and reports back with callback function', () => {
        const badwords = new BadWordsNext({ data: en })
        const detected: string[] = []
        badwords.filter('hello sex sex3 b0000b test b00b anyfuckany pussy cat', (badword: string) => {
          detected.push(badword)
        })
        expect(detected).toStrictEqual(['sex', 'sex3', 'b0000b', 'b00b', 'anyfuckany', 'pussy'])
      })

      it('filters and replaces with repeated placeholder', () => {
        const badwords = new BadWordsNext({ data: en, placeholder: '#', placeholderMode: 'repeat' })
        expect(badwords.filter('$h1ttt')).toBe('######')
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
        const input = 'sex: sexy male sh1t ꮪ𝐞𝔁 ꮪ𝐞𝔁y semen $emen b@d bad'

        let badwords = new BadWordsNext({ data })
        expect(badwords.filter(input)).toBe('*** *** male *** *** *** *** *** *** bad')

        badwords = new BadWordsNext({ data, exclusions: ['sex', 'semen', 'b@*'] })
        expect(badwords.filter(input)).toBe('sex: *** male *** ꮪ𝐞𝔁 *** semen $emen b@d bad')
      })

      it('filters with exclusions containing lookalikes', () => {
        let badwords = new BadWordsNext({ data: en })
        expect(badwords.filter('shhhh1t++ happens')).toBe('*** happens')

        badwords = new BadWordsNext({ data: en, exclusions: ['sh+it+'] })
        expect(badwords.filter('shhhh1t++ happens')).toBe('shhhh1t++ happens')
      })

      it('only preCheck called if there are no bad words', () => {
        const badwords = new BadWordsNext({ data: en })

        const spyCheck = jest.spyOn(badwords, 'check')
        const spyPreCheck = jest.spyOn(badwords, 'preCheck')

        badwords.filter('A text without badwords')

        expect(spyPreCheck).toBeCalledTimes(1)
        expect(spyCheck).toBeCalledTimes(0)
      })
    })
  })

  describe('en', () => {
    const badwords = new BadWordsNext({ data: en })

    describe('check()', () => {
      it('checks subwords', () => {
        expect(badwords.check('anyfuckany')).toBeTruthy()
      })

      it('checks an empty string', () => {
        expect(badwords.check('')).toBeFalsy()
      })

      it('checks words at start', () => {
        expect(badwords.check('masturbate')).toBeTruthy()
      })

      it('checks whole words', () => {
        expect(badwords.check('hore')).toBeTruthy()
      })

      it('checks words in sentence', () => {
        expect(badwords.check('small titties are great')).toBeTruthy()
      })

      it('checks words with special chars boundary', () => {
        expect(badwords.check('!!hore))')).toBeTruthy()
      })

      it('checks words with repeating chars', () => {
        expect(badwords.check('boooob')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('800000b')).toBeTruthy()
        expect(badwords.check('sh!+')).toBeTruthy()
        expect(badwords.check('$ex')).toBeTruthy()
      })

      it('checks words with special space chars', () => {
        expect(badwords.check('blow-job')).toBeTruthy()
        expect(badwords.check('blow_job')).toBeTruthy()
        expect(badwords.check('blow.job')).toBeTruthy()
        expect(badwords.check('blowjob')).toBeTruthy()
      })

      it('checks confusables', () => {
        expect(badwords.check('ꮪ𝐞𝔁')).toBeTruthy()
      })

      it('checks words with good chars', () => {
        expect(badwords.check('cat')).toBeFalsy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('hello sex sex3 b0000b test b00b anyfuckany pussy cat')).toBe('hello *** *** *** test *** *** *** cat')
      })

      it('filters bad words with spaces', () => {
        expect(badwords.filter('see   cock-$ucking f@tfuckers @round')).toBe('see   *** *** @round')
      })
    })
  })

  describe('ru', () => {
    const badwords = new BadWordsNext({ data: ru })

    describe('check()', () => {
      it('checks subwords', () => {
        expect(badwords.check('заебатенько')).toBeTruthy()
      })

      it('checks whole words', () => {
        expect(badwords.check('еб')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('H@хуйA')).toBeTruthy()
        expect(badwords.check('C🆈к🇦!')).toBeTruthy()
      })

      it('checks words with good chars', () => {
        expect(badwords.check('кот')).toBeFalsy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('кто ты сY4к@ 6лять а?')).toBe('кто ты *** *** а?')
      })
    })
  })

  describe('ru_lat', () => {
    const badwords = new BadWordsNext({ data: rl })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('zalupa')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('3@luPa')).toBeTruthy()
      })

      it('checks confusables', () => {
        expect(badwords.check('𝔁🆈u')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('etot pidar huy')).toBe('etot *** ***')
      })
    })
  })

  describe('ua', () => {
    const badwords = new BadWordsNext({ data: ua })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('то є падлюка така мала')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('п🅸3д🇦то')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('то є дупа йолопа')).toBe('то є *** ***')
      })
    })
  })

  describe('es', () => {
    const badwords = new BadWordsNext({ data: es })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('Mucho jilipollas')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('El Cabrón y La Puta')).toBe('El *** y La ***')
      })
    })
  })

  describe('ch', () => {
    const badwords = new BadWordsNext({ data: ch })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('幹你娘')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('幹你娘 妓女')).toBe('*** ***')
      })
    })
  })

  describe('fr', () => {
    const badwords = new BadWordsNext({ data: fr })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('connard')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('étron')).toBe('***')
      })
    })
  })

  describe('pl', () => {
    const badwords = new BadWordsNext({ data: pl })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('dupa kurwy')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('dupa kurwy')).toBe('*** ***')
      })
    })
  })

  describe('de', () => {
    const badwords = new BadWordsNext({ data: de })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('die scheiße')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('Ich kacke sehr gut')).toBe('Ich *** sehr gut')
      })
    })
  })
})
