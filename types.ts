export interface Winner {
  id: number;
  premio: string;
  numero: number;
  timestamp: Date;
}

export enum SpinType {
  PRIZE = 'PRIZE',
  NUMBER = 'NUMBER'
}