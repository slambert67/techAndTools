export interface AllocatedFlight {
  direction: string;
  id: number;
  flightIdentity: string;
  flightRepeatCount: number;
  scheduledTime: Date;
  allocationStartTime: Date;
  allocationEndTime: Date;
}
