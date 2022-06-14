type FilterFunc<T> = (arg: T) => T

/**
 * 引数と戻り値の型が同じ関数を数珠つなぎに合成する
 */
export const pipe = <T>(...functions: FilterFunc<T>[]): FilterFunc<T> => {
  return (t) => {
    let ret = t
    functions.forEach((func) => {
      ret = func(ret)
    })
    return ret
  }
}
