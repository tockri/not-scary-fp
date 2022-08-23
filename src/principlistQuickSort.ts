import { SortAlgorithm } from './SortAlgorithm'

/*
{ }とreturn文を無くしたい原理主義者のコード
文が無い = 式の組み合わせだけで表現している = 考え方を最も間違いなく表現している
 */
export const principlistQuickSort: SortAlgorithm = (arr, capture) =>
  arr.length <= 1
    ? arr
    : capture(
        principlistQuickSort(
          arr.filter((num) => num < arr[0]),
          capture
        )
          .concat(arr[0])
          .concat(
            principlistQuickSort(
              arr.slice(1).filter((num) => num >= arr[0]),
              capture
            )
          )
      )
