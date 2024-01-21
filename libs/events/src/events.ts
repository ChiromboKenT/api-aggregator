// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Events {
  export const API_RESOLVED = 'API_RESOLVED';
  export const API_AGGREGATED = 'API_AGGREGATED';
  export const AGGREGATOR_TRIGGERED = 'AGGREGATOR_TRIGGERED';
}

export type EventType = (typeof Events)[keyof typeof Events];

export interface EventAttributes {
  [key: string]: string;
  correlationId?: string;
}
