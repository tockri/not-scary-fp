export type Validated<T> = {
  readonly value: T
  readonly isValid: boolean
  readonly errorMessage: string
}

export const valid = <T>(value: T): Validated<T> => ({
  value,
  isValid: true,
  errorMessage: '',
})

export const appendError = <T>(
  validated: Validated<T>,
  message: string
): Validated<T> => {
  return {
    ...validated,
    isValid: false,
    errorMessage: message,
  }
}

export type ValidationFunc<T> = (validated: Validated<T>) => Validated<T>
