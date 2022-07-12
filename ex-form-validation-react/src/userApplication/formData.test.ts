import {
  FormData,
  FormDataFunctions_FOR_TEST,
  FormDataFunctions,
} from './formData'
import { Validated, valid } from '../common/validated'

const Priv = FormDataFunctions_FOR_TEST
const Funcs = FormDataFunctions

test('checkPattern passes a valid zip code', () => {
  expect(
    Priv.checkPattern(/\d{3}-\d{4}/, '')(valid('100-0001'))
  ).toStrictEqual<Validated<string>>({
    value: '100-0001',
    hasError: false,
    errorMessage: '',
  })
})

test('checkPattern rejects if not match', () => {
  expect(
    Priv.checkPattern(/^\d{3}-\d{4}$/, 'not match')(valid('abc'))
  ).toStrictEqual<Validated<string>>({
    value: 'abc',
    hasError: true,
    errorMessage: 'not match',
  })
})

test('normalizeZipFormat normalize a zip code with no "-"', () => {
  expect(Priv.normalizeZipFormat(valid('1001234'))).toStrictEqual<
    Validated<string>
  >({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('normalizeToAscii normalize a zip code with no "-" with CJK', () => {
  expect(Priv.normalizeToAscii(valid('１００-１２３４'))).toStrictEqual<
    Validated<string>
  >({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('checkEmpty rejects an empty string', () => {
  expect(Priv.checkEmpty('empty')(valid(''))).toStrictEqual<
    Validated<string>
  >({
    value: '',
    hasError: true,
    errorMessage: 'empty',
  })
})

const initial = Funcs.initialFormData

test('validateName rejects an empty string', () => {
  expect(
    Funcs.setNameOnTyping(initial, '')
  ).toStrictEqual<FormData>({
    ...initial,
    name: {
      value: '',
      hasError: true,
      errorMessage: '名前を入力してください',
    },
  })
})

test('validateAddressOnTyping rejects an empty string', () => {
  expect(
    Funcs.setAddressOnTyping(initial, '')
  ).toStrictEqual<FormData>({
    ...initial,
    address: {
      value: '',
      hasError: true,
      errorMessage: '住所を入力してください',
    },
  })
})

test('validateMailAddress rejects an empty string', () => {
  expect(
    Funcs.setMailAddressOnTyping(initial, '')
  ).toStrictEqual<FormData>({
    ...initial,
    mailAddress: {
      value: '',
      hasError: true,
      errorMessage: 'メールアドレスを入力してください',
    },
  })
})

test('normalizeMailAddress normalizes to ascii letter', () => {
  expect(
    Funcs.setMailAddressOnFinish(initial, 'ｓｔ＠ＥＸＡｍｐｌｅ．ｃｏｍ')
  ).toStrictEqual<FormData>({
    ...initial,
    mailAddress: {
      value: 'st@example.com',
      hasError: false,
      errorMessage: '',
    },
  })
})

test('normalizeMailAddress rejects invalid pattern', () => {
  expect(
    Funcs.setMailAddressOnFinish(initial, 'not.a.email.address')
  ).toStrictEqual<FormData>({
    ...initial,
    mailAddress: {
      value: 'not.a.email.address',
      hasError: true,
      errorMessage: 'メールアドレスの形式が正しくありません',
    },
  })
})
