export type FormInputValue<T> = {
  readonly value: T
  readonly hasError: boolean
  readonly errorMessage: string
}

export const formInput = <T>(value: T): FormInputValue<T> => ({
  value,
  hasError: false,
  errorMessage: '',
})

export type FormInputFunc<T> = (v: FormInputValue<T>) => FormInputValue<T>
