export interface Action {
  run(body: unknown): unknown;
}
