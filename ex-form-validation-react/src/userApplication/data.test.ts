import {
  UserApplicationFormData,
  UserApplicationFormData_FOR_TEST,
  UserApplicationFormDataFunctions,
} from './data'
import { formInput, FormInputValue } from '../common/formInputValue'

const VT = UserApplicationFormData_FOR_TEST
const Handler = UserApplicationFormDataFunctions

test('checkPattern passes a valid zip code', () => {
  expect(
    VT.checkPattern(/\d{3}-\d{4}/, '')(formInput('100-0001'))
  ).toStrictEqual<FormInputValue<string>>({
    value: '100-0001',
    hasError: false,
    errorMessage: '',
  })
})

test('checkPattern rejects if not match', () => {
  expect(
    VT.checkPattern(/^\d{3}-\d{4}$/, 'not match')(formInput('abc'))
  ).toStrictEqual<FormInputValue<string>>({
    value: 'abc',
    hasError: true,
    errorMessage: 'not match',
  })
})

test('normalizeZipFormat normalize a zip code with no "-"', () => {
  expect(VT.normalizeZipFormat(formInput('1001234'))).toStrictEqual<
    FormInputValue<string>
  >({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('normalizeToAscii normalize a zip code with no "-" with CJK', () => {
  expect(VT.normalizeToAscii(formInput('１００-１２３４'))).toStrictEqual<
    FormInputValue<string>
  >({
    value: '100-1234',
    hasError: false,
    errorMessage: '',
  })
})

test('checkEmpty rejects an empty string', () => {
  expect(VT.checkEmpty('empty')(formInput(''))).toStrictEqual<
    FormInputValue<string>
  >({
    value: '',
    hasError: true,
    errorMessage: 'empty',
  })
})

const initial = Handler.initialize()

test('validateName rejects an empty string', () => {
  expect(
    Handler.setNameOnTyping(initial, '')
  ).toStrictEqual<UserApplicationFormData>({
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
    Handler.setAddressOnTyping(initial, '')
  ).toStrictEqual<UserApplicationFormData>({
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
    Handler.setMailAddressOnTyping(initial, '')
  ).toStrictEqual<UserApplicationFormData>({
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
    Handler.setMailAddressOnFinish(initial, 'ｓｔ＠ＥＸＡｍｐｌｅ．ｃｏｍ')
  ).toStrictEqual<UserApplicationFormData>({
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
    Handler.setMailAddressOnFinish(initial, 'not.a.email.address')
  ).toStrictEqual<UserApplicationFormData>({
    ...initial,
    mailAddress: {
      value: 'not.a.email.address',
      hasError: true,
      errorMessage: 'メールアドレスの形式が正しくありません',
    },
  })
})
