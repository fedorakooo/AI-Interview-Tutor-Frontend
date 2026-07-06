export type CVUploadStatus = "pending" | "processing" | "completed" | "failed";

export type CVErrorCode =
  | "FILE_EMPTY"
  | "FILE_TOO_LARGE"
  | "INVALID_PDF"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "S3_UPLOAD_FAILED"
  | "PUBLISH_FAILED";

export interface CVUploadAcceptedResponse {
  correlation_id: string;
  status: string;
  message?: string;
}

export interface CVStatusResponse {
  correlation_id: string;
  status: CVUploadStatus;
  original_filename: string | null;
  error_code: CVErrorCode | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
