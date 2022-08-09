import { Validated, valid } from '../common/validated'
import {
  checkEmpty,
  checkPattern,
  normalizeToAscii,
  normalizeZipFormat
} from './validationFuncs'

test('checkPattern passes a valid zip code', () => {
  expect(checkPattern(/\d{3}-\d{4}/, '')(valid('100-0001'))).toStrictEqual<
      Validated<string>
      >({
    value: '100-0001',
    hasError: false,
    errorMessage: ''
  })
})

test('checkPattern rejects if not match', () => {
  expect(
      checkPattern(/^\d{3}-\d{4}$/, 'not match')(valid('abc'))
  ).toStrictEqual<Validated<string>>({
    value: 'abc',
    hasError: true,
    errorMessage: 'not match'
  })
})

test('normalizeZipFormat normalize a zip code with no "-"', () => {
  expect(normalizeZipFormat(valid('1001234'))).toStrictEqual<Validated<string>>(
      {
        value: '100-1234',
        hasError: false,
        errorMessage: ''
      }
  )
})

test('normalizeToAscii normalize a zip code with no "-" with CJK', () => {
  expect(normalizeToAscii(valid('１００-１２３４'))).toStrictEqual<
      Validated<string>
      >({
    value: '100-1234',
    hasError: false,
    errorMessage: ''
  })
})

test('checkEmpty rejects an empty string', () => {
  expect(checkEmpty('empty')(valid(''))).toStrictEqual<Validated<string>>({
    value: '',
    hasError: true,
    errorMessage: 'empty'
  })
})
