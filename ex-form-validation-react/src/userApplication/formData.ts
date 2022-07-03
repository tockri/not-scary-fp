import {
  Validated,
  createValidated,
  ValidationFunc,
} from '../common/validated'

import { pipe } from '../common/fp'

/**
 * 全角英数をASCII文字に変換する
 */
const normalizeToAscii: ValidationFunc<string> = (validated) => {
  function toAscii(str: string) {
    return str
      .replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 65248)
      )
      .replace(/[ー－−―‐]/g, '-') // いろんな横棒を半角ハイフンに正規化
  }
  return {
    ...validated,
    value: toAscii(validated.value),
  }
}

/**
 * 4桁～7桁の数字が入力されたら間にハイフンを入れる
 */
const normalizeZipFormat: ValidationFunc<string> = (validated) => {
  function normalize(str: string) {
    const m = str.match(/^(\d{3})(\d{1,4})$/)
    if (m) {
      return m[1] + '-' + m[2]
    } else {
      return str
    }
  }
  return {
    ...validated,
    value: normalize(validated.value),
  }
}


/**
 * 大文字を小文字に変換する
 */
const normalizeToLower: ValidationFunc<string> = (validated) => ({
  ...validated,
  value: validated.value.toLowerCase(),
})

/**
 * 空だったらエラー
 */
const checkEmpty =
  (errorMessage: string): ValidationFunc<string> =>
    (validated) => {
      if (validated.hasError || validated.value) {
        return validated
      } else {
        return {
          value: validated.value,
          hasError: true,
          errorMessage,
        }
      }
    }

/**
 * 正規表現に一致してなかったらエラー
 */
const checkPattern =
  (pattern: RegExp, errorMessage: string): ValidationFunc<string> =>
    (validated) => {
      if (validated.hasError || validated.value.match(pattern)) {
        return validated
      } else {
        return {
          value: validated.value,
          hasError: true,
          errorMessage,
        }
      }
    }

export const FormDataFunctions_FOR_TEST = {
  normalizeToAscii,
  normalizeToLower,
  normalizeZipFormat,
  checkEmpty,
  checkPattern,
}

/**
 * ユーザー情報フォームのデータ
 */
export type FormData = {
  readonly name: Validated<string>
  readonly zipCode: Validated<string>
  readonly address: Validated<string>
  readonly mailAddress: Validated<string>
}

const initialize = (): FormData => ({
  name: createValidated(''),
  zipCode: createValidated(''),
  address: createValidated(''),
  mailAddress: createValidated(''),
})

/**
 * FormDataを入力値で更新する関数
 */
export type FormDataSetter = (
  curr: FormData,
  value: string
) => FormData

const setNameOnTyping: FormDataSetter = (curr, value) => ({
  ...curr,
  name: checkEmpty('名前を入力してください')(createValidated(value)),
})

const setMailAddressOnTyping: FormDataSetter = (
  curr,
  value
) => ({
  ...curr,
  mailAddress: checkEmpty('メールアドレスを入力してください')(
    createValidated(value)
  ),
})

const setMailAddressOnFinish: FormDataSetter = (
  curr,
  value
) => ({
  ...curr,
  mailAddress: pipe(
    normalizeToAscii,
    normalizeToLower,
    checkPattern(
      /^[\w.]+@[\w.]+[^.]$/, // この正規表現は嘘なので使ってはいけません。
      'メールアドレスの形式が正しくありません'
    )
  )(createValidated(value)),
})

const setZipCodeOnTyping: FormDataSetter = (curr, value) => ({
  ...curr,
  zipCode: checkEmpty('郵便番号を入力してください')(createValidated(value)),
})

const setZipCodeOnFinish: FormDataSetter = (curr, value) => ({
  ...curr,
  zipCode: pipe(
    normalizeToAscii,
    normalizeZipFormat,
    checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
  )(createValidated(value)),
})

const setAddressOnTyping: FormDataSetter = (curr, value) => ({
  ...curr,
  address: checkEmpty('住所を入力してください')(createValidated(value)),
})

const setAddressOnFinish: FormDataSetter = (curr, value) => ({
  ...curr,
  address: normalizeToAscii(createValidated(value)),
})

const isSubmittable = (data: FormData): boolean => {
  const ok = <T>(v: Validated<T>) => !!v.value && !v.hasError
  return (
    ok(data.name) &&
    ok(data.mailAddress) &&
    ok(data.address) &&
    ok(data.zipCode)
  )
}

export const FormDataFunctions = {
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
