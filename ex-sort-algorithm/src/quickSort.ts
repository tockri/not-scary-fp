import { SortAlgorithm } from './SortAlgorithm'

/*
真面目な（普通の）クイックソート
考え方を知ってても書くのはなかなか難しい
 */
export const quickSort: SortAlgorithm = (initial, capture) => {
  // console.log(initial)
  const work = Array.from(initial)
  const swap = (i: number, j: number) => {
    if (i !== j) {
      const tmp = work[i]
      work[i] = work[j]
      work[j] = tmp
      capture(work)
    }
  }
  const doQuickSort = (from: number, to: number) => {
    const p = work[from]
    let left = from
    let right = to
    while (left <= right) {
      while (p < work[right]) {
        right--
      }
      while (work[left] < p) {
        left++
      }
      if (left <= right) {
        swap(left, right)
        left++
        right--
      }
    }
    if (from < left - 1) {
      doQuickSort(from, left - 1)
    }
    if (left < to) {
      doQuickSort(left, to)
    }
  }
  doQuickSort(0, initial.length - 1)
  return work
}
