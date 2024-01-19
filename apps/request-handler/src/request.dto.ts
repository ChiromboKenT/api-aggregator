// To keep things simple, we will use interfaces instead of DTO and this can later be replaced with DTOs

export interface GetAllGamesRequest {}

export interface GetSpecificGameRequest {
  gameId: string;
}

export interface GetFullGameDataRequest {
  gameId: string;
  dateTime: string;
}

export interface ApiResponse {
  data: any;
  message: string;
}
