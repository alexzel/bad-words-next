import BadWordsNext from './index'
import en from '../data/en.json'
import ru from '../data/ru.json'
import rl from '../data/ru_lat.json'
import ua from '../data/ua.json'
import es from '../data/es.json'
import ch from '../data/ch.json'
import fr from '../data/fr.json'
import pl from '../data/pl.json'
import de from '../data/de.json'

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
    })

    it('creates new instance with default options', () => {
      const badwords = new BadWordsNext({ data: en })
      expect(badwords).toHaveProperty('opts')
      expect(badwords).toHaveProperty('opts.data')
      expect(badwords).toHaveProperty('opts.placeholder')
      expect(badwords).toHaveProperty('opts.specialChars')
      expect(badwords).toHaveProperty('opts.spaceChars')
      expect(badwords).toHaveProperty('opts.confusables')
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
    })
  })

  describe('en', () => {
    const badwords = new BadWordsNext({ data: en })

    describe('check()', () => {
      it('checks subwords', () => {
        expect(badwords.check('anyfuckany')).toBeTruthy()
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
        expect(badwords.check('???????????')).toBeTruthy()
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
        expect(badwords.check('??????????????????????')).toBeTruthy()
      })

      it('checks whole words', () => {
        expect(badwords.check('????')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('H@??????A')).toBeTruthy()
        expect(badwords.check('C??????????!')).toBeTruthy()
      })

      it('checks words with good chars', () => {
        expect(badwords.check('??????')).toBeFalsy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('?????? ???? ??Y4??@ 6???????? ???')).toBe('?????? ???? *** *** ???')
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
        expect(badwords.check('????????u')).toBeTruthy()
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
        expect(badwords.check('???? ?? ?????????????? ???????? ????????')).toBeTruthy()
      })

      it('checks words with lookalike chars', () => {
        expect(badwords.check('??????3??????????')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('???? ?? ???????? ????????????')).toBe('???? ?? *** ***')
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
        expect(badwords.filter('El Cabr??n y La Puta')).toBe('El *** y La ***')
      })
    })
  })

  describe('ch', () => {
    const badwords = new BadWordsNext({ data: ch })

    describe('check()', () => {
      it('checks words', () => {
        expect(badwords.check('?????????')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('????????? ??????')).toBe('*** ***')
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
        expect(badwords.filter('??tron')).toBe('***')
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
        expect(badwords.check('die schei??e')).toBeTruthy()
      })
    })

    describe('filter()', () => {
      it('filters bad words', () => {
        expect(badwords.filter('Ich kacke sehr gut')).toBe('Ich *** sehr gut')
      })
    })
  })
})
