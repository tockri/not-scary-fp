export type Func<T, S> = (arg: T) => S

export const pipe = <T>(...functions: Func<T, T>[]): Func<T, T> => {
  return (t) => {
    let ret = t
    functions.forEach((func) => {
      ret = func(ret)
    })
    return ret
  }
}
