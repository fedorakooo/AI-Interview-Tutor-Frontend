export interface UserMgmtError {
  detail: string;
}

export interface CVError {
  detail: string;
  error_code?: string;
}

export interface PracticeError {
  detail: {
    error_code: string;
    message: string;
  };
}

export type ApiError = UserMgmtError | CVError | PracticeError;
