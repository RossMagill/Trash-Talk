export enum BinType {
  RECYCLING = 'Recycling',
  COMPOST = 'Compost',
  GARBAGE = 'Garbage',
  UNKNOWN = 'Unknown'
}

export interface TrashAnalysis {
  item: string;
  bin: BinType;
  sassyComment: string;
  confidence: number;
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  RANKING = 'RANKING'
}