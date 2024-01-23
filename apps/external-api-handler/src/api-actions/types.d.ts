export interface Action {
  run(body: unknown): unknown;
  handleGetAllGames?(body: unknown): unknown;
  handleGetGameById?(body: unknown): unknown;
}
