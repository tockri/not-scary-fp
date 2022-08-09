import { ValidationFunc } from '../common/validated'

/**
 * 全角英数をASCII文字に変換する
 */
export const normalizeToAscii: ValidationFunc<string> = (validated) => {
  function toAscii(str: string) {
    return str
        .replace(/[Ａ-Ｚａ-ｚ０-９＠．]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 65248)
        )
        .replace(/[ー－−―‐]/g, '-') // いろんな横棒を半角ハイフンに正規化
  }
  return {
    ...validated,
    value: toAscii(validated.value)
  }
}

/**
 * 4桁～7桁の数字が入力されたら間にハイフンを入れる
 */
export const normalizeZipFormat: ValidationFunc<string> = (validated) => {
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
    value: formatZip(validated.value)
  }
}

/**
 * 大文字を小文字に変換する
 */
export const normalizeToLower: ValidationFunc<string> = (validated) => ({
  ...validated,
  value: validated.value.toLowerCase()
})

/**
 * 空だったらエラー
 */
export const checkEmpty = (errorMessage: string): ValidationFunc<string> => (
    validated
) => {
  if (validated.hasError || validated.value) {
    return validated
  } else {
    return {
      value: validated.value,
      hasError: true,
      errorMessage
    }
  }
}

/**
 * 正規表現に一致してなかったらエラー
 */
export const checkPattern = (
    pattern: RegExp,
    errorMessage: string
): ValidationFunc<string> => (validated) => {
  if (validated.hasError || validated.value.match(pattern)) {
    return validated
  } else {
    return {
      value: validated.value,
      hasError: true,
      errorMessage
    }
  }
}
