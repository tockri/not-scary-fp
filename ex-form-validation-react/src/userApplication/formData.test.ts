import {
  FormData,
  initialFormData,
  setAddressOnTyping,
  setMailAddressOnFinish,
  setMailAddressOnTyping,
  setNameOnTyping
} from './formData'

const initial = initialFormData

test('validateName rejects an empty string', () => {
  expect(setNameOnTyping(initial, '')).toStrictEqual<FormData>({
    ...initial,
    name: {
      value: '',
      hasError: true,
      errorMessage: '名前を入力してください'
    }
  })
})

test('validateAddressOnTyping rejects an empty string', () => {
  expect(setAddressOnTyping(initial, '')).toStrictEqual<FormData>({
    ...initial,
    address: {
      value: '',
      hasError: true,
      errorMessage: '住所を入力してください'
    }
  })
})

test('validateMailAddress rejects an empty string', () => {
  expect(setMailAddressOnTyping(initial, '')).toStrictEqual<FormData>({
    ...initial,
    mailAddress: {
      value: '',
      hasError: true,
      errorMessage: 'メールアドレスを入力してください'
    }
  })
})

test('normalizeMailAddress normalizes to ascii letter', () => {
  expect(
      setMailAddressOnFinish(initial, 'ｓｔ＠ＥＸＡｍｐｌｅ．ｃｏｍ')
  ).toStrictEqual<FormData>({
    ...initial,
    mailAddress: {
      value: 'st@example.com',
      hasError: false,
      errorMessage: ''
    }
  })
})

test('normalizeMailAddress rejects invalid pattern', () => {
  expect(setMailAddressOnFinish(initial, 'not.a.email.address')).toStrictEqual<
      FormData
      >({
    ...initial,
    mailAddress: {
      value: 'not.a.email.address',
      hasError: true,
      errorMessage: 'メールアドレスの形式が正しくありません'
    }
  })
})
