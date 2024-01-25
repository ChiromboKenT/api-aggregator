// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Events {
  export const API_RESOLVED = 'API_RESOLVED';
  export const API_AGGREGATED = 'API_AGGREGATED';
  export const API_REQUESTED = 'API_REQUESTED';
  export const API_REQUEST_COMPLETED = 'API_REQUEST_COMPLETED';
  export const AGGREGATOR_TRIGGERED = 'AGGREGATOR_TRIGGERED';
  export const AGGREGATOR_COMPLETED = 'AGGREGATOR_COMPLETED';
}

export type EventType = (typeof Events)[keyof typeof Events];

export interface EventAttributes {
  [key: string]: string;
  correlationId?: string;
}
