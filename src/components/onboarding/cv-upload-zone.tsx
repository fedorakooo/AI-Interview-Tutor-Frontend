"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cvApi } from "@/lib/api/cv";
import { AppError } from "@/lib/api/client";
import { useCvStatus } from "@/lib/hooks/use-cv-status";
import { getCvErrorMessage, CV_STATUS_MESSAGES } from "@/lib/utils/cv-errors";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { cn } from "@/lib/utils";
import type { CVUploadStatus } from "@/lib/types/cv";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME = "application/pdf";

type CvUploadZoneProps = {
  initialCorrelationId?: string | null;
};

function isPdfFile(file: File): boolean {
  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const hasPdfMime = !file.type || file.type === ACCEPTED_MIME;
  return hasPdfExtension && hasPdfMime;
}

async function validatePdfContent(file: File): Promise<boolean> {
  const header = await file.slice(0, 5).text();
  return header.startsWith("%PDF-");
}

export function CvUploadZone({ initialCorrelationId }: CvUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [correlationId, setCorrelationId] = useState<string | null>(
    initialCorrelationId ?? null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const activeCorrelationId = correlationId ?? initialCorrelationId ?? null;
  const { data: statusData, isFetching: isPolling } = useCvStatus(activeCorrelationId);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => cvApi.upload(file),
    onSuccess: (response) => {
      setCorrelationId(response.correlation_id);
      setValidationError(null);
    },
    onError: (error) => {
      if (error instanceof AppError) {
        setValidationError(getCvErrorMessage(error.errorCode, error.message));
      }
      handleApiError(error);
    },
  });

  const uploadStatus: CVUploadStatus | "idle" | "uploading" =
    uploadMutation.isPending
      ? "uploading"
      : statusData?.status ?? (activeCorrelationId ? "pending" : "idle");

  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    if (!isPdfFile(file)) {
      return getCvErrorMessage("UNSUPPORTED_MEDIA_TYPE");
    }
    if (file.size === 0) {
      return getCvErrorMessage("FILE_EMPTY");
    }
    if (file.size > MAX_FILE_SIZE) {
      return getCvErrorMessage("FILE_TOO_LARGE");
    }
    const isValidPdf = await validatePdfContent(file);
    if (!isValidPdf) {
      return getCvErrorMessage("INVALID_PDF");
    }
    return null;
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      const error = await validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        return;
      }
      setValidationError(null);
      setSelectedFile(file);
    },
    [validateFile],
  );

  const handleUpload = async () => {
    if (!selectedFile) return;
    const error = await validateFile(selectedFile);
    if (error) {
      setValidationError(error);
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCorrelationId(null);
    setValidationError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isProcessing =
    uploadStatus === "pending" || uploadStatus === "processing" || uploadStatus === "uploading";
  const isCompleted = uploadStatus === "completed";
  const isFailed = uploadStatus === "failed";


  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload your resume</CardTitle>
        <CardDescription>
          Upload a PDF resume (max 10 MB). We will analyze it to personalize your interview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCompleted && (
          <Alert>
            <CheckCircle2 className="text-green-600" />
            <AlertTitle>Analysis complete</AlertTitle>
            <AlertDescription>{CV_STATUS_MESSAGES.completed}</AlertDescription>
          </Alert>
        )}

        {isFailed && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Analysis failed</AlertTitle>
            <AlertDescription>
              {statusData?.error_message ??
                getCvErrorMessage(statusData?.error_code, CV_STATUS_MESSAGES.failed)}
              {statusData?.error_code && (
                <span className="mt-1 block text-xs opacity-80">
                  Error code: {statusData.error_code}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isProcessing && !isFailed && (
          <Alert>
            <Loader2 className="animate-spin" />
            <AlertTitle>Processing your resume</AlertTitle>
            <AlertDescription>
              {uploadStatus === "uploading"
                ? "Uploading your file..."
                : CV_STATUS_MESSAGES[uploadStatus as "pending" | "processing"]}
              {statusData?.original_filename && (
                <span className="mt-1 block text-xs">
                  File: {statusData.original_filename}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {!isProcessing && !isCompleted && (
          <>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragOver(false);
                void handleFile(event.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              <Upload className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Drag and drop your PDF here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(event) => void handleFile(event.target.files?.[0])}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReset();
                  }}
                  aria-label="Remove file"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}

            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => void handleUpload()}
                disabled={!selectedFile || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload and analyze"
                )}
              </Button>
              {isFailed && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Try again
                </Button>
              )}
            </div>
          </>
        )}

        {isCompleted && (
          <Button type="button" variant="outline" onClick={handleReset}>
            Upload a different resume
          </Button>
        )}

        {isFailed && !selectedFile && (
          <Button type="button" onClick={handleReset}>
            Upload another file
          </Button>
        )}

        {isPolling && isProcessing && (
          <p className="text-xs text-muted-foreground">Checking analysis status...</p>
        )}
      </CardContent>
    </Card>
  );
}
