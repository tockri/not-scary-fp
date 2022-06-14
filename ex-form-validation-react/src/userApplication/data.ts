import { Validated, ValidationFunc, valid } from '../common/validation'

import { pipe } from '../common/fp'

/**
 * ユーザー情報フォームのデータ
 */
export type ApplicationFormData = {
  readonly name: Validated<string>
  readonly zipCode: Validated<string>
  readonly address: Validated<string>
  readonly mailAddress: Validated<string>
}

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

const validateName: ValidationFunc<string> = pipe(
  checkEmpty('名前を入力してください')
)

const validateZipCode: ValidationFunc<string> = pipe(
  checkEmpty('郵便番号を入力してください')
)

const normalizeZipCode: ValidationFunc<string> = pipe(
  normalizeToAscii,
  normalizeZipFormat,
  checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
)

const validateAddress: ValidationFunc<string> = pipe(
  checkEmpty('住所を入力してください')
)

const normalizeAddress: ValidationFunc<string> = pipe(
  normalizeToAscii
)

const validateMailAddress: ValidationFunc<string> = pipe(
  checkEmpty('メールアドレスを入力してください'),
)

const normalizeMailAddress: ValidationFunc<string> = pipe(
  normalizeToAscii,
  normalizeToLower,
  checkPattern(
    /^[\w\.]+@[\w\.]+[^\.]$/, // この正規表現は嘘なので使ってはいけません。
    'メールアドレスの形式が正しくありません'
  )
)

export const ApplicationFormValidator_FOR_TEST = {
  validateName: validateName,
  validateZipCode: pipe(validateZipCode, normalizeZipCode),
  validateAddress: pipe(validateAddress, normalizeAddress),
  validateMailAddress: pipe(validateMailAddress, normalizeMailAddress),
}

const initialize = (): ApplicationFormData => ({
  name: valid(''),
  zipCode: valid(''),
  address: valid(''),
  mailAddress: valid(''),
})

export type ApplicationFormValueSetter<T> = (
  curr: ApplicationFormData,
  value: T
) => ApplicationFormData

const makeSetter =
  <T>(
    key: keyof ApplicationFormData,
    func: ValidationFunc<T>
  ): ApplicationFormValueSetter<T> =>
    (curr, value) => ({
      ...curr,
      [key]: func(valid(value)),
    })

const isSubmittable = (data: ApplicationFormData): boolean => {
  const ok = <T>(v: Validated<T>) => !!v.value && !v.hasError
  return (
    ok(data.name) &&
    ok(data.mailAddress) &&
    ok(data.address) &&
    ok(data.zipCode)
  )
}

export const ApplicationFormData = {
  initialize,
  setName: makeSetter('name', validateName),
  setMailAddress: makeSetter('mailAddress', validateMailAddress),
  normalizeMailAddress: makeSetter('mailAddress', normalizeMailAddress),
  setAddress: makeSetter('address', validateAddress),
  normalizeAddress: makeSetter('address', normalizeAddress),
  setZipCode: makeSetter('zipCode', validateZipCode),
  normalizeZipCode: makeSetter('zipCode', normalizeZipCode),
  isSubmittable,
}
