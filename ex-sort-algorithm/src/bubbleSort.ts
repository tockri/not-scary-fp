import { SortAlgorithm } from './SortAlgorithm'

export const bubbleSort: SortAlgorithm = (initial, capture) => {
  const work = Array.from(initial)
  const swap = (i: number, j: number) => {
    if (i !== j) {
      const tmp = work[i]
      work[i] = work[j]
      work[j] = tmp
      capture(work)
    }
  }
  for (let i = 0; i < work.length; i++) {
    for (let j = i; j < work.length; j++) {
      if (work[j] < work[i]) {
        swap(i, j)
      }
    }
  }
  return work
}
