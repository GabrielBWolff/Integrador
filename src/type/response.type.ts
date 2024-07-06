export type ResponseProps<T> = {
  status: number;
  data?: T;
  errors?: ErrorResponse[];
}

export type ErrorResponse = {
  message: string;
  data?: any;
}