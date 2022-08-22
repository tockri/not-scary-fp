export type Capture = (snapshot: ReadonlyArray<number>) => ReadonlyArray<number>

export type SortAlgorithm = (
  initial: ReadonlyArray<number>,
  capture: Capture
) => ReadonlyArray<number>
