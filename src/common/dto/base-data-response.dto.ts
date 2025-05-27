export interface BaseDataResponseDto<T = any> {
    responseCode: string;
    responseMessage: string;
    data: T | null;
  }