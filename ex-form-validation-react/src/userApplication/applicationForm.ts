import { appendError, Validated, ValidationFunc } from './validation'

import { pipe } from './fp'

export type ApplicationFormData = {
  readonly name: Validated<string>
  readonly zipCode: Validated<string>
  readonly address: Validated<string>
  readonly mailAddress: Validated<string>
}

export const isApplicationFormSubmittable = (
  formData: ApplicationFormData
): boolean =>
  formData.name.isValid &&
  formData.mailAddress.isValid &&
  formData.address.isValid &&
  formData.mailAddress.isValid

const normalizeToAscii: ValidationFunc<string> = (validated) => {
  function toAscii(str: string) {
    return str
      .replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248)
      })
      .replace(/[ー−―‐]/, '-') // いろんな横棒を半角ハイフンに正規化
  }
  return {
    ...validated,
    value: toAscii(validated.value),
  }
}

const normalizeZipFormat: ValidationFunc<string> = (validated) => {
  function normalize(str: string) {
    const m = str.match(/^(\d{3})(\d{4})$/)
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

const normalizeToLower: ValidationFunc<string> = (validated) => ({
  ...validated,
  value: validated.value.toLowerCase(),
})

const checkEmpty =
  (errorMessage: string): ValidationFunc<string> =>
  (validated) => {
    if (!validated.isValid || validated.value) {
      return validated
    } else {
      return appendError(validated, errorMessage)
    }
  }

const checkPattern =
  (pattern: RegExp, errorMessage: string): ValidationFunc<string> =>
  (validated) => {
    if (!validated.isValid || validated.value.match(pattern)) {
      return validated
    } else {
      return appendError(validated, errorMessage)
    }
  }

const validateName: ValidationFunc<string> = pipe(
  checkEmpty('名前を入力してください')
)

const validateZipCode: ValidationFunc<string> = pipe(
  checkEmpty('郵便番号を入力してください'),
  normalizeToAscii,
  normalizeZipFormat,
  checkPattern(/^\d{3}-\d{4}$/, '000-0000の書式で入力してください')
)

const validateAddress: ValidationFunc<string> = pipe(
  checkEmpty('住所を入力してください')
)

const validateMailAddress: ValidationFunc<string> = pipe(
  checkEmpty('メールアドレスを入力してください'),
  normalizeToAscii,
  normalizeToLower,
  checkPattern(
    /^[\w\.]+@[\w\.]+[^\.]$/, // この正規表現は嘘なので使ってはいけません。
    'メールアドレスの形式が正しくありません'
  )
)

export const ApplicationFormValidator = {
  validateName,
  validateZipCode,
  validateAddress,
  validateMailAddress,
}
