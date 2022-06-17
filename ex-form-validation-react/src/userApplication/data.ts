import {
  FormInputValue,
  FormInputFunc,
  formInput,
} from '../common/formInputValue'

import { pipe } from '../common/fp'

/**
 * 全角英数をASCII文字に変換する
 */
const normalizeToAscii: FormInputFunc<string> = (fiv) => {
  function toAscii(str: string) {
    return str
      .replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 65248)
      )
      .replace(/[ー－−―‐]/g, '-') // いろんな横棒を半角ハイフンに正規化
  }
  return {
    ...fiv,
    value: toAscii(fiv.value),
  }
}

/**
 * 4桁～7桁の数字が入力されたら間にハイフンを入れる
 */
const normalizeZipFormat: FormInputFunc<string> = (fiv) => {
  function normalize(str: string) {
    const m = str.match(/^(\d{3})(\d{1,4})$/)
    if (m) {
      return m[1] + '-' + m[2]
    } else {
      return str
    }
  }
  return {
    ...fiv,
    value: normalize(fiv.value),
  }
}

/**
 * 大文字を小文字に変換する
 */
const normalizeToLower: FormInputFunc<string> = (fiv) => ({
  ...fiv,
  value: fiv.value.toLowerCase(),
})

/**
 * 空だったらエラー
 */
const checkEmpty =
  (errorMessage: string): FormInputFunc<string> =>
  (fiv) => {
    if (fiv.hasError || fiv.value) {
      return fiv
    } else {
      return {
        value: fiv.value,
        hasError: true,
        errorMessage,
      }
    }
  }

/**
 * 正規表現に一致してなかったらエラー
 */
const checkPattern =
  (pattern: RegExp, errorMessage: string): FormInputFunc<string> =>
  (fiv) => {
    if (fiv.hasError || fiv.value.match(pattern)) {
      return fiv
    } else {
      return {
        value: fiv.value,
        hasError: true,
        errorMessage,
      }
    }
  }

export const UserApplicationFormData_FOR_TEST = {
  normalizeToAscii,
  normalizeToLower,
  normalizeZipFormat,
  checkEmpty,
  checkPattern,
}

/**
 * ユーザー情報フォームのデータ
 */
export type UserApplicationFormData = {
  readonly name: FormInputValue<string>
  readonly zipCode: FormInputValue<string>
  readonly address: FormInputValue<string>
  readonly mailAddress: FormInputValue<string>
}

const initialize = (): UserApplicationFormData => ({
  name: formInput(''),
  zipCode: formInput(''),
  address: formInput(''),
  mailAddress: formInput(''),
})

export type UserApplicationFormDataSetter = (
  curr: UserApplicationFormData,
  value: string
) => UserApplicationFormData

const setNameOnTyping: UserApplicationFormDataSetter = (curr, value) => ({
  ...curr,
  name: pipe(checkEmpty('名前を入力してください'))(formInput(value)),
})

const setMailAddressOnTyping: UserApplicationFormDataSetter = (
  curr,
  value
) => ({
  ...curr,
  mailAddress: pipe(checkEmpty('メールアドレスを入力してください'))(
    formInput(value)
  ),
})

const setMailAddressOnFinish: UserApplicationFormDataSetter = (
  curr,
  value
) => ({
  ...curr,
  mailAddress: pipe(
    normalizeToAscii,
    normalizeToLower,
    checkPattern(
      /^[\w\.]+@[\w\.]+[^\.]$/, // この正規表現は嘘なので使ってはいけません。
      'メールアドレスの形式が正しくありません'
    )
  )(formInput(value)),
})

const setZipCodeOnTyping: UserApplicationFormDataSetter = (curr, value) => ({
  ...curr,
  zipCode: pipe(checkEmpty('郵便番号を入力してください'))(formInput(value)),
})

const setZipCodeOnFinish: UserApplicationFormDataSetter = (curr, value) => ({
  ...curr,
  zipCode: pipe(
    normalizeToAscii,
    normalizeZipFormat,
    checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
  )(formInput(value)),
})

const setAddressOnTyping: UserApplicationFormDataSetter = (curr, value) => ({
  ...curr,
  address: pipe(checkEmpty('住所を入力してください'))(formInput(value)),
})

const setAddressOnFinish: UserApplicationFormDataSetter = (curr, value) => ({
  ...curr,
  address: pipe(normalizeToAscii)(formInput(value)),
})

const isSubmittable = (data: UserApplicationFormData): boolean => {
  const ok = <T>(v: FormInputValue<T>) => !!v.value && !v.hasError
  return (
    ok(data.name) &&
    ok(data.mailAddress) &&
    ok(data.address) &&
    ok(data.zipCode)
  )
}

export const UserApplicationFormDataFunctions = {
  initialize,
  setNameOnTyping,
  setMailAddressOnTyping,
  setMailAddressOnFinish,
  setZipCodeOnTyping,
  setZipCodeOnFinish,
  setAddressOnTyping,
  setAddressOnFinish,
  isSubmittable,
}
