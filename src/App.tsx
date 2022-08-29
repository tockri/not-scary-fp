import { Button, CircularProgress, Stack, Box } from '@mui/material'
import React from 'react'
import {
  AlgorithmName,
  recordSortingProcess,
  SortingHistory
} from './recordSortingProcess'
import { SortAnimator } from './SortAnimator'

const Loading: React.FC = () => (
  <CircularProgress
    size={20}
    sx={{ marginLeft: 1, color: 'gray.500' }}
    color="inherit"
  />
)

function makeRandomArray(): ReadonlyArray<number> {
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
    makeRandomArray()
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
      size="small"
    >
      {props.label}
      {animating === props.algorithmName ? <Loading /> : null}
    </Button>
  )

  return (
    <Box margin={2}>
      <Stack spacing={1} direction="column" alignItems="flex-start">
        <StartButton algorithmName="bubbleSort" label="Bubble Sort" />
        <StartButton algorithmName="quickSort" label="Quick Sort" />
        <StartButton
          label="Millionaire QuickSort"
          algorithmName="millionaireQuickSort"
        />
        <StartButton
          label="Billionaire QuickSort"
          algorithmName="billionaireQuickSort"
        />
        <StartButton
          label="Principlist QuickSort"
          algorithmName="principlistQuickSort"
        />
        <Button
          size="small"
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
    </Box>
  )
}
