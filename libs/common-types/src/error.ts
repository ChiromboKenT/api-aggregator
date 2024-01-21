export interface Error<T = any> {
  message: string;
  error: T;
}
