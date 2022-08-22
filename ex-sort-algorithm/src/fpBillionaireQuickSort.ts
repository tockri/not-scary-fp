import { SortAlgorithm } from './SortAlgorithm'

/*
{ }とreturn文を無くしたい原理主義者のコード
文が無い = 式の組み合わせだけで表現している = 考え方を最も間違いなく表現している
 */
export const fpBillionaireQuickSort: SortAlgorithm = (
  arr,
  capture
): ReadonlyArray<number> =>
  arr.length <= 1
    ? arr
    : capture(
        fpBillionaireQuickSort(
          arr.filter((num) => num < arr[0]),
          capture
        )
          .concat(arr[0])
          .concat(
            fpBillionaireQuickSort(
              arr.slice(1).filter((num) => num >= arr[0]),
              capture
            )
          )
      )
