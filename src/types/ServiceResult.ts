export interface ServiceResult<T> {
  success: boolean;
  errorType?: ErrorType;
  errors?: Error | string;
  content?: T;
}

export enum ErrorType {
  DEFAULT = 0,
  FATAL = 1,
}
