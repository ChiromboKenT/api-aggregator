interface EventMessage<P> {
  requestId: string;
  serviceName: string;
  actionType: string;
  payload: P;
}
