export type ApiResponseModel = {
  code: number;
  success: number;
  message: string;
  errors: ApiErrorsModel[];
};

export type ApiErrorsModel = {
  code: string;
  message: string;
};