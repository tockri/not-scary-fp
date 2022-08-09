import { Validated, valid, ValidationFunc } from '../common/validated'
import {
  checkEmpty,
  checkPattern,
  normalizeToAscii,
  normalizeToLower,
  normalizeZipFormat
} from './validationFuncs'
import { pipe } from '../common/fp'

/**
 * ユーザー情報フォームのデータ
 */
export type FormData = {
  readonly name: Validated<string>
  readonly mailAddress: Validated<string>
  readonly zipCode: Validated<string>
  readonly address: Validated<string>
}

export const initialFormData: FormData = {
  name: valid(''),
  mailAddress: valid(''),
  zipCode: valid(''),
  address: valid('')
}

/**
 * FormDataを入力値で更新する関数
 */
export type FormDataSetter = (curr: FormData, value: string) => FormData

/**
 * FormDataSetterの関数を短いコードで生成する糖衣
 */
const setter = (
    key: keyof FormData,
    ...functions: ValidationFunc<string>[]
): FormDataSetter => (curr, value) => ({
  ...curr,
  [key]: pipe(...functions)(valid(value))
})

/**
 * 名前の入力時にリアルタイムでエラーをチェックする
 */
export const setNameOnTyping = setter(
    'name',
    checkEmpty('名前を入力してください')
)

/**
 * メールアドレスの入力時にリアルタイムでエラーをチェックする
 */
export const setMailAddressOnTyping = setter(
    'mailAddress',
    checkEmpty('メールアドレスを入力してください')
)

/**
 * メールアドレスの入力完了時に内容を更新しつつエラーをチェックする
 */
export const setMailAddressOnFinish = setter(
    'mailAddress',
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
export const setZipCodeOnTyping = setter(
    'zipCode',
    checkEmpty('郵便番号を入力してください')
)

/**
 * 郵便番号の入力完了時に内容を更新しつつエラーをチェックする
 */
export const setZipCodeOnFinish = setter(
    'zipCode',
    normalizeToAscii,
    normalizeZipFormat,
    checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
)

/**
 * 住所の入力時にリアルタイムでエラーをチェックする
 */
export const setAddressOnTyping = setter(
    'address',
    checkEmpty('住所を入力してください')
)

/**
 * 住所の入力完了時に内容を更新しつつエラーをチェックする
 */
export const setAddressOnFinish = setter('address', normalizeToAscii)

/**
 * フォームを送信していいか判定する
 */
export const isSubmittable = (data: FormData): boolean => {
  const ok = <T>(v: Validated<T>) => !!v.value && !v.hasError
  return (
      ok(data.name) &&
      ok(data.mailAddress) &&
      ok(data.address) &&
      ok(data.zipCode)
  )
}
