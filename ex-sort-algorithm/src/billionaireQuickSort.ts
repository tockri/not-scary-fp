import { SortAlgorithm } from './SortAlgorithm'

/*
さらに処理速度を犠牲にしてクイックソートの考え方をかなりそのまま表現したコード
代入文で処理の途中の値に名前をつけている
 */
export const billionaireQuickSort: SortAlgorithm = (arr, capture) => {
  if (arr.length <= 1) {
    return arr
  }
  const pivot = arr[0]
  const smaller = billionaireQuickSort(
    arr.filter((num) => num < pivot),
    capture
  )
  const larger = billionaireQuickSort(
    arr.slice(1).filter((num) => num >= pivot),
    capture
  )
  return capture(smaller.concat(pivot, larger))
}
