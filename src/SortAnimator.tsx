import { Box, colors, styled } from '@mui/material'
import React from 'react'
import { SortingHistory } from './recordSortingProcess'

type SortAnimatorProps = {
  history: SortingHistory
  onFinish: () => void
}

const ItemContainer = styled(Box)({
  position: 'relative',
  top: 12,
  height: 70,
  width: '100%'
})

const itemSize = 30

const ItemBox = styled(Box)({
  position: 'absolute',
  transition: 'left .4s ease-in-out',
  top: 10,
  width: itemSize,
  height: itemSize,
  fontSize: 14,
  textAlign: 'center',
  paddingTop: 4
})

type PosItem = {
  value: number
  pos: number
  changed: boolean
}

const makePositions = (
  history: ReadonlyArray<ReadonlyArray<number>>,
  frame: number
): ReadonlyArray<PosItem> => {
  const idx = Math.min(frame, history.length - 1)
  const current = history[idx]
  const prev = history[Math.max(idx - 1, 0)]
  return current
    .map((num, i) => ({
      value: num,
      pos: i,
      changed: current.length === prev.length && num !== prev[i]
    }))
    .sort((i1, i2) => i1.value - i2.value)
}

export const SortAnimator: React.FC<SortAnimatorProps> = (props) => {
  const { history, onFinish } = props
  const [frame, setFrame] = React.useState(0)
  const positions = makePositions(history, frame)
  React.useEffect(() => {
    if (frame < history.length - 1) {
      setTimeout(() => {
        setFrame(frame + 1)
      }, 400)
    } else {
      if (history.length === 1) {
        setFrame(0)
      } else {
        onFinish()
      }
    }
  }, [history.length, frame, onFinish])
  return (
    <Box>
      <ItemContainer>
        {positions.map((item) => (
          <ItemBox
            key={item.value}
            id={`item-${item.value}`}
            sx={{
              left: (itemSize + 10) * item.pos,
              backgroundColor:
                item.changed && frame < history.length - 1
                  ? '#ffcc00'
                  : colors.grey[200]
            }}
          >
            {item.value}
          </ItemBox>
        ))}
      </ItemContainer>
      <Box>{frame}</Box>
    </Box>
  )
}
