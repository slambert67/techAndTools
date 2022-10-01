import { AllocatedGate } from './AllocatedGate';

export interface Flight {
  direction: string;
  id: number;
  flightIdentity: string;
  flightRepeatCount: number;
  scheduledTime: Date;
  gates: AllocatedGate[];
  remarkText1: string;
  remarkText2: string;
}
