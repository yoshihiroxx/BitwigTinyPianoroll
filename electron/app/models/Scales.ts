import { Record, List } from 'immutable';

export type ScaleType = {
  gridIndices: List<number>;
  signatures: List<number>;
};

const cmaj: ScaleType = {
  gridIndices: List([0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]),
  signatures: List([0, 0, 0, 0, 0, 0, 0])
};
const cmajSharp: ScaleType = {
  gridIndices: List([0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]),
  signatures: List([1, 1, 1, 1, 1, 1, 1])
};

const ScalesRecord = Record<ScaleType>({
  gridIndices: [0, 0]
});

export default class Scales extends ScalesRecord {}
