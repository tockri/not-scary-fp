import { Button, CircularProgress, Container, Stack } from '@mui/material'
import React from 'react'
import {
  AlgorithmName,
  recordSortingProcess,
  SortingHistory,
} from './recordSortingProcess'
import { SortAnimator } from './SortAnimator'

const makeRandomArray = (): ReadonlyArray<number> => {
  const ARRAY_SIZE = 10
  const arr: number[] = []
  for (let i = 0; i < ARRAY_SIZE; i++) {
    arr[i] = i + 1
  }
  for (let i = 0; i < ARRAY_SIZE; i++) {
    const idx = Math.floor(Math.random() * ARRAY_SIZE)
    const work = arr[idx]
    arr[idx] = arr[i]
    arr[i] = work
  }
  return arr
}

export const App: React.FC = () => {
  const [history, setHistory] = React.useState<SortingHistory>([
    makeRandomArray(),
  ])
  const [animating, setAnimating] = React.useState<AlgorithmName | null>(null)

  const reset = () => setHistory([makeRandomArray()])

  const onAnimationFinished = () => setAnimating(null)

  const startAnimation = (algorithm: AlgorithmName) => () => {
    setAnimating(algorithm)
    try {
      const newHistory = recordSortingProcess(
        history[history.length - 1],
        algorithm
      )
      if (newHistory.length > 1) {
        setHistory(newHistory)
      } else {
        setAnimating(null)
      }
    } catch (err) {
      console.error(err)
      setAnimating(null)
    }
  }

  const StartButton = (props: {
    label: string
    algorithmName: AlgorithmName
  }) => (
    <Button
      onClick={startAnimation(props.algorithmName)}
      variant="contained"
      disabled={!!animating}
    >
      {props.label}
      {animating === props.algorithmName ? <Loading /> : null}
    </Button>
  )

  return (
    <Container>
      <Stack direction="row" spacing={2}>
        <StartButton algorithmName="bubbleSort" label="Bubble Sort" />
        <StartButton algorithmName="quickSort" label="Quick Sort" />
        <StartButton
          label="Millionaire QuickSort"
          algorithmName="millionaireQuickSort"
        />
      </Stack>
      <Stack direction="row" spacing={2} marginTop={2}>
        <StartButton
          label="Billionaire QuickSort"
          algorithmName="billionaireQuickSort"
        />
        <StartButton
          label="FP Billionaire QuickSort"
          algorithmName="fpBillionaireQuickSort"
        />
        <Button
          onClick={reset}
          variant="contained"
          color="inherit"
          disabled={!!animating}
        >
          Reset
        </Button>
      </Stack>
      <SortAnimator history={history} onFinish={onAnimationFinished} />
      {animating ? 'sorting...' : ''}
    </Container>
  )
}

const Loading: React.FC = () => (
  <CircularProgress
    size={20}
    sx={{ marginLeft: 1, color: 'gray.500' }}
    color="inherit"
  />
)
