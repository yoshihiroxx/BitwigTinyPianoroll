export type ScaleType = {
  name: string;
  gridIndices: Array<number>;
  signatures: Array<number>;
  keyNames: Array<string>;
};

const Scales: Array<ScaleType> = [
  {
    name: 'cmaj',
    gridIndices: [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6],
    signatures: [0, 0, 0, 0, 0, 0, 0],
    keyNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  },
  {
    name: 'cmaj#',
    gridIndices: [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6],
    signatures: [1, 1, 1, 1, 1, 1, 1],
    keyNames: [
      'B#',
      'C#',
      'D',
      'D#',
      'E',
      'E#',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B'
    ]
  }
];

export default Scales;
