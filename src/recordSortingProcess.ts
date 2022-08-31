import { Capture, SortAlgorithm } from './SortAlgorithm'
import { bubbleSort } from './bubbleSort'
import { quickSort } from './quickSort'
import { millionaireQuickSort } from './millionaireQuickSort'
import { billionaireQuickSort } from './billionaireQuickSort'
import { principlistQuickSort } from './principlistQuickSort'

const algorithms = {
  bubbleSort,
  quickSort,
  millionaireQuickSort,
  billionaireQuickSort,
  principlistQuickSort
}

export type AlgorithmName = keyof typeof algorithms

export type SortingHistory = ReadonlyArray<ReadonlyArray<number>>

const assertArraysEqual = (
  expected: ReadonlyArray<number>,
  answer: ReadonlyArray<number>
) => {
  if (JSON.stringify(answer) !== JSON.stringify(expected)) {
    console.log('failed', {
      answer,
      expected
    })
    throw new Error('Sort failed!')
  }
}

export const recordSortingProcess = (
  initial: ReadonlyArray<number>,
  algorithmName: AlgorithmName
): SortingHistory => {
  const data: Array<ReadonlyArray<number>> = []
  const expected = [...initial].sort((a, b) => a - b)
  data.push(initial)
  const capture: Capture = (snapshot) => {
    data.push([...snapshot])
    return snapshot
  }
  const sorter: SortAlgorithm = algorithms[algorithmName]
  const answer = sorter(initial, capture)
  assertArraysEqual(expected, answer)
  return data
}
