import type { Data } from './index'

const ResolvedTextDecoder = typeof window !== 'undefined'
  ? window.TextDecoder
  : TextDecoder

const PolyfilledTextDecoder = typeof ResolvedTextDecoder !== 'undefined'
  ? ResolvedTextDecoder
  : (() => {
      /**
       * @license TextDecoder polyfill
       * Copyright (c) 2013, Viktor Mukhachev. (CC0 1.0 License)
       * https://gist.github.com/Yaffle/5458286
       */

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      function TextDecoderPolyfill () {}

      TextDecoderPolyfill.prototype.decode = function (octets: string) {
        let result: string = ''
        let octet: number
        let bytesNeeded: number
        let codePoint: number
        let i: number = 0
        while (i < octets.length) {
          octet = octets[i] as any
          bytesNeeded = 0
          codePoint = 0
          if (octet <= 0x7F) {
            bytesNeeded = 0
            codePoint = octet & 0xFF
          } else if (octet <= 0xDF) {
            bytesNeeded = 1
            codePoint = octet & 0x1F
          } else if (octet <= 0xEF) {
            bytesNeeded = 2
            codePoint = octet & 0x0F
          } else if (octet <= 0xF4) {
            bytesNeeded = 3
            codePoint = octet & 0x07
          }
          if (octets.length - i - bytesNeeded > 0) {
            let k = 0
            while (k < bytesNeeded) {
              octet = octets[i + k + 1] as any
              codePoint = (codePoint << 6) | (octet & 0x3F)
              k += 1
            }
          } else {
            codePoint = 0xFFFD
            bytesNeeded = octets.length - i
          }
          result += String.fromCodePoint(codePoint)
          i += bytesNeeded + 1
        }
        return result
      }

      return TextDecoderPolyfill as any as {
        prototype: TextDecoder
        new(label?: string, options?: TextDecoderOptions): TextDecoder
      }
    })()

const createBytesBuffer = typeof Uint8Array !== 'undefined'
  ? (bytes: number[]) => new Uint8Array(bytes)
  : (bytes: number[]) => Buffer.from(bytes)

export default (hex: string): Data => {
  let prev = ''
  let byte
  const bytes = []
  for (let i = 0; i < hex.length; i++) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (i & 1 && prev) {
      byte = parseInt(prev + hex[i], 16)
      if (isNaN(byte)) {
        throw new Error('badWordsNext: incorrect hex string supplied as a dictionary')
      }
      bytes.push(byte)
      prev = ''
    } else {
      prev += hex[i]
    }
  }
  const json = (new PolyfilledTextDecoder()).decode(createBytesBuffer(bytes))
  let obj
  try {
    obj = JSON.parse(json)
  } catch (e) {
    throw new Error('badWordsNext: dictionary hex string does not contain json object')
  }
  return obj
}
