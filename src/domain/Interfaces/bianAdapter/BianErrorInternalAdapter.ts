export interface BianErrorInternalAdapter {
  Message: string;
  Status_code: string;
}
export interface BianApiResponse {
  Code: number;
  Description: string;
  Errors?: ErrorResponse | null;
}
export interface ServiceErrorResponse {
  errorCode: string;
  errorMessage: string;
}

export interface ErrorResponse {
  errors: ServiceErrorResponse[];
}
