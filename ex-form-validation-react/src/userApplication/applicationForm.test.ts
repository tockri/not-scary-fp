import { ApplicationFormData, ApplicationFormValidator_FOR_TEST } from './applicationForm'
import { valid, Validated } from './validation'

const VT = ApplicationFormValidator_FOR_TEST

test('validateZipCode passes a valid zip code', () => {
  expect(VT.validateZipCode(valid('100-0001'))).toStrictEqual<Validated<string>>({
    value: '100-0001',
    hasError: false,
    errorMessage: '',
  })
})

test('validateZipCode normalize a zip code with no "-"', () => {
  expect(VT.validateZipCode(valid('1001234'))).toStrictEqual<Validated<string>>({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('validateZipCode normalize a zip code with no "-" with CJK', () => {
  expect(VT.validateZipCode(valid('１００１２３４'))).toStrictEqual<Validated<string>>({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('validateZipCode rejects a invalid zip code', () => {
  expect(VT.validateZipCode(valid('１００１２−３４'))).toStrictEqual<Validated<string>>({
    value: '10012-34',
    hasError: true,
    errorMessage: '000-0000の書式で入力してください',
  })
})

test('validateZipCode rejects an empty string', () => {
  expect(VT.validateZipCode(valid(''))).toStrictEqual<Validated<string>>({
    value: '',
    hasError: true,
    errorMessage: '郵便番号を入力してください',
  })
})

test('validateName rejects an empty string', () => {
  expect(VT.validateName(valid(''))).toStrictEqual<Validated<string>>({
    value: '',
    hasError: true,
    errorMessage: '名前を入力してください',
  })
})

test('validateAddress rejects an empty string', () => {
  expect(VT.validateAddress(valid(''))).toStrictEqual<Validated<string>>({
    value: '',
    hasError: true,
    errorMessage: '住所を入力してください',
  })
})

test('validateMailAddress rejects an empty string', () => {
  expect(VT.validateMailAddress(valid(''))).toStrictEqual<Validated<string>>({
    value: '',
    hasError: true,
    errorMessage: 'メールアドレスを入力してください',
  })
})

test('validateMailAddress normalizes to ascii letter', () => {
  expect(
    VT.validateMailAddress(valid('ｓｔ＠ｅｘａｍｐｌｅ．ｃｏｍ'))
  ).toStrictEqual<Validated<string>>({
    value: 'st@example.com',
    hasError: false,
    errorMessage: '',
  })
})

test('validateMailAddress normalizes to lower-case letter', () => {
  expect(
    VT.validateMailAddress(valid('ｓｔ＠ＥＸＡｍｐｌｅ．ｃｏｍ'))
  ).toStrictEqual<Validated<string>>({
    value: 'st@example.com',
    hasError: false,
    errorMessage: '',
  })
})

test('validateMailAddress rejects invalid pattern', () => {
  expect(VT.validateMailAddress(valid('not.a.email.address'))).toStrictEqual<Validated<string>>({
    value: 'not.a.email.address',
    hasError: true,
    errorMessage: 'メールアドレスの形式が正しくありません',
  })
})
