export type Validated<T> = {
  readonly value: T
  readonly hasError: boolean
  readonly errorMessage: string
}

export const createValidated = <T>(value: T): Validated<T> => ({
  value,
  hasError: false,
  errorMessage: '',
})

export type ValidationFunc<T> = (v: Validated<T>) => Validated<T>
