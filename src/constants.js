export const WHITE = '#F5EDF9';
export const LIGHT_BLUE = '#79ADDC';
export const DARK_BLUE = '#5656CE';
export const GRAY = '#514F59';
export const BLACK = '#1D1128';

export const N_OCTAVES = 3;

export const pieces = {
  'None': [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ],
  'A': [
    [12, 7, 4],
    [13, 10, 6],
    [14, 9, 6],
    [15, 12, 8],
    [16, 12, 7],
    [17, 12, 9],
    [18, 14, 9],
    [19, 14, 11],
    [20, 15, 12],
    [21, 17, 12],
    [22, 17, 14],
    [23, 19, 14]
  ],
  'B': [
    [3, 9, 12],
    [2, 4, 9, 13],
    [6, 11, 14],
    [6, 9, 15],
    [7, 11, 14, 16],
    [12, 15, 17],
    [10, 13, 18],
    [12, 16, 19],
    [8, 15, 20],
    [14, 19, 21],
    [14, 20, 22],
    [14, 18, 23],
  ]
};

export const noteNames = [
  'C ',
  'C#',
  'D ',
  'D#',
  'E ',
  'F ',
  'F#',
  'G ',
  'G#',
  'A ',
  'A#',
  'B '
]

export const keyboardCharacterMap = {
    'a': 0,
    'w': 1,
    's': 2,
    'e': 3,
    'd': 4,
    'f': 5,
    't': 6,
    'g': 7,
    'y': 8,
    'h': 9,
    'u': 10,
    'j': 11,
    'k': 12,
    'o': 13,
    'l': 14,
    'p': 15,
    ';': 16,
    'A': 17,
    'W': 18,
    'S': 19,
    'E': 20,
    'D': 21,
    'R': 22,
    'F': 23,
    'G': 24,
    'Y': 25,
    'H': 26,
    'U': 27,
    'J': 28,
    'K': 29,
    'O': 30,
    'L': 31,
    'P': 32,
    ':': 33,
    '{': 34,
    '"': 35
  };

export const tonnetzKeyboardCharacterMap = {
  'w': 3,
  'e': 10,
  'r': 5,
  't': 0,
  'y': 7,
  'u': 2,
  'i': 9,
  's': 0,
  'd': 7,
  'f': 2,
  'g': 9,
  'h': 4,
  'j': 11,
  'k': 6,
  'z': 9,
  'x': 4,
  'c': 11,
  'v': 6,
  'b': 1,
  'n': 8,
  'm': 3
}

export const circleOfFifthsKeyboardCharacterMap = {
    'a': 0,
    'w': 7,
    's': 2,
    'e': 9,
    'd': 4,
    'r': 11,
    'f': 6,
    'g': 8,
    'y': 1,
    'h': 3,
    'u': 10,
    'j': 5,
    'k': 12,
    'o': 19,
    'l': 14,
    'p': 21,
    ';': 16,
    'A': 23,
    'W': 18,
    'S': 20,
    'E': 13,
    'D': 15,
    'R': 22,
    'F': 17,
    'G': 24,
    'Y': 31,
    'H': 26,
    'U': 33,
    'J': 28,
    'K': 35,
    'O': 30,
    'L': 32,
    'P': 25,
    ':': 27,
    '{': 34,
    '"': 29 
  };

  export const circleOfFifthsMidiMap = [
    8,
    1,
    3,
    10,
    5,
    0,
    7,
    2,
    9,
    4,
    11,
    6
  ]