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
  function formatZip(str: string) {
    const m = str.match(/^(\d{3})(\d{1,4})$/)
    if (m) {
      return m[1] + '-' + m[2]
    } else {
      return str
    }
  }
  return {
    ...validated,
    value: formatZip(validated.value),
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

/**
 * FormDataStterの関数を短いコードで生成する糖衣
 */
const makeSetter = (key: keyof FormData, ...functions: ValidationFunc<string>[]): FormDataSetter =>
  (curr, value) => ({
    ...curr,
    [key]: pipe(...functions)(createValidated(value))
  })

/**
 * 名前の入力時にリアルタイムでエラーをチェックする
 */
const setNameOnTyping = makeSetter('name',
  checkEmpty('名前を入力してください'))

/**
 * メールアドレスの入力時にリアルタイムでエラーをチェックする
 */
const setMailAddressOnTyping = makeSetter('mailAddress',
  checkEmpty('メールアドレスを入力してください'))

/**
 * メールアドレスの入力完了時に内容を更新しつつエラーをチェックする
 */
const setMailAddressOnFinish = makeSetter('mailAddress',
  normalizeToAscii,
  normalizeToLower,
  checkPattern(
    /^[\w.]+@[\w.]+[^.]$/, // この正規表現は嘘なので使ってはいけません。
    'メールアドレスの形式が正しくありません'
  )
)

/**
 * 郵便番号の入力時にリアルタイムでエラーをチェックする
 */
const setZipCodeOnTyping = makeSetter('zipCode',
  checkEmpty('郵便番号を入力してください'))

/**
 * 郵便番号の入力完了時に内容を更新しつつエラーをチェックする
 */
const setZipCodeOnFinish = makeSetter('zipCode',
  normalizeToAscii,
  normalizeZipFormat,
  checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
)

/**
 * 住所の入力時にリアルタイムでエラーをチェックする
 */
const setAddressOnTyping = makeSetter('address',
  checkEmpty('住所を入力してください'))

/**
 * 住所の入力完了時に内容を更新しつつエラーをチェックする
 */
const setAddressOnFinish = makeSetter('address',
  normalizeToAscii
)

/**
 * フォームを送信していいか判定する
 */
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
