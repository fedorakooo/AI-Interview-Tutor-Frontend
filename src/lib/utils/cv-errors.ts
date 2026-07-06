import type { CVErrorCode } from "@/lib/types/cv";

const CV_ERROR_MESSAGES: Record<CVErrorCode, string> = {
  FILE_EMPTY: "The file appears to be empty. Please upload a valid PDF.",
  FILE_TOO_LARGE: "File exceeds 10 MB limit. Please compress or use a smaller PDF.",
  INVALID_PDF: "This file doesn't appear to be a valid PDF.",
  UNSUPPORTED_MEDIA_TYPE: "Only PDF files are supported.",
  S3_UPLOAD_FAILED: "Upload failed. Please try again later.",
  PUBLISH_FAILED: "Could not queue analysis. Please try again later.",
};

export function getCvErrorMessage(
  errorCode: string | undefined | null,
  fallback?: string,
): string {
  if (errorCode && errorCode in CV_ERROR_MESSAGES) {
    return CV_ERROR_MESSAGES[errorCode as CVErrorCode];
  }
  return fallback ?? "An error occurred while processing your CV.";
}

export const CV_STATUS_MESSAGES: Record<
  "pending" | "processing" | "completed" | "failed",
  string
> = {
  pending: "Upload received, waiting to process...",
  processing: "Analyzing your resume...",
  completed: "Resume ready! You can start your interview.",
  failed: "CV analysis failed. Please try uploading again.",
};
