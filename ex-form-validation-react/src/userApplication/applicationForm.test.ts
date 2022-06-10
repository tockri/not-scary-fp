import { ApplicationFormValidator } from './applicationForm'
import { valid } from './validation'

test('validateZipCode passes a valid zip code', () => {
  expect(
    ApplicationFormValidator.validateZipCode(valid('100-0001'))
  ).toStrictEqual({
    value: '100-0001',
    isValid: true,
    errorMessage: '',
  })
})

test('validateZipCode normalize a zip code with no "-"', () => {
  expect(
    ApplicationFormValidator.validateZipCode(valid('1001234'))
  ).toStrictEqual({
    value: '100-1234',
    isValid: true,
    errorMessage: '',
  })
})

test('validateZipCode normalize a zip code with no "-" with CJK', () => {
  expect(
    ApplicationFormValidator.validateZipCode(valid('１００１２３４'))
  ).toStrictEqual({
    value: '100-1234',
    isValid: true,
    errorMessage: '',
  })
})

test('validateZipCode rejects a invalid zip code', () => {
  expect(
    ApplicationFormValidator.validateZipCode(valid('１００１２−３４'))
  ).toStrictEqual({
    value: '10012-34',
    isValid: false,
    errorMessage: '000-0000の書式で入力してください',
  })
})

test('validateZipCode rejects an empty string', () => {
  expect(ApplicationFormValidator.validateZipCode(valid(''))).toStrictEqual({
    value: '',
    isValid: false,
    errorMessage: '郵便番号を入力してください',
  })
})

test('validateName rejects an empty string', () => {
  expect(ApplicationFormValidator.validateName(valid(''))).toStrictEqual({
    value: '',
    isValid: false,
    errorMessage: '名前を入力してください',
  })
})

test('validateAddress rejects an empty string', () => {
  expect(ApplicationFormValidator.validateAddress(valid(''))).toStrictEqual({
    value: '',
    isValid: false,
    errorMessage: '住所を入力してください',
  })
})

test('validateMailAddress rejects an empty string', () => {
  expect(ApplicationFormValidator.validateMailAddress(valid(''))).toStrictEqual(
    {
      value: '',
      isValid: false,
      errorMessage: 'メールアドレスを入力してください',
    }
  )
})

test('validateMailAddress normalizes to ascii letter', () => {
  expect(
    ApplicationFormValidator.validateMailAddress(
      valid('ｓｔ＠ｅｘａｍｐｌｅ．ｃｏｍ')
    )
  ).toStrictEqual({
    value: 'st@example.com',
    isValid: true,
    errorMessage: '',
  })
})

test('validateMailAddress normalizes to lower-case letter', () => {
  expect(
    ApplicationFormValidator.validateMailAddress(
      valid('ｓｔ＠ＥＸＡｍｐｌｅ．ｃｏｍ')
    )
  ).toStrictEqual({
    value: 'st@example.com',
    isValid: true,
    errorMessage: '',
  })
})

test('validateMailAddress rejects invalid pattern', () => {
  expect(
    ApplicationFormValidator.validateMailAddress(valid('not.a.email.address'))
  ).toStrictEqual({
    value: 'not.a.email.address',
    isValid: false,
    errorMessage: 'メールアドレスの形式が正しくありません',
  })
})
