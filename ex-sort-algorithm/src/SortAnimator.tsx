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
  width: '100%',
})

const ItemBox = styled(Box)({
  position: 'absolute',
  transition: 'left .2s ease-in-out',
  top: 0,
  width: 60,
  height: 60,
  background: colors.grey[200],
  fontSize: 20,
  textAlign: 'center',
  paddingTop: 15,
})

const makePositions = (
  data: ReadonlyArray<ReadonlyArray<number>>,
  frame: number
): Map<number, number> => {
  const idx = Math.min(frame, data.length - 1)
  const items = data[idx]
  const ret = new Map<number, number>()
  items.forEach((item, i) => ret.set(item, i))
  return ret
}

export const SortAnimator: React.FC<SortAnimatorProps> = (props) => {
  const { history, onFinish } = props
  const [frame, setFrame] = React.useState(0)
  const positions = makePositions(history, frame)
  React.useEffect(() => {
    if (frame < history.length - 1) {
      setTimeout(() => {
        setFrame(frame + 1)
      }, 300)
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
        {Array.from(positions.keys())
          .sort()
          .map((item, i) => {
            const pos = positions.get(item) || 0
            return (
              <ItemBox key={i} id={`item-${item}`} sx={{ left: 70 * pos }}>
                {item}
              </ItemBox>
            )
          })}
      </ItemContainer>
      <Box>{frame}</Box>
    </Box>
  )
}
