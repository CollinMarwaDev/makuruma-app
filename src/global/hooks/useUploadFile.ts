import { useCallback, useState } from "react";
import { API_BASE_URL } from "~/services/apiClient";
import {
    UploadMediaResponseSchema,
    type UploadMediaResponseType,
} from "~/global/utils/zod-common/upload-media-schema";

interface UseUploadFileOptions {
    /** API path (relative to VITE_API_BASE_URL) that accepts a multipart `file` field. */
    endpoint?: string;
    formFields?: Record<string, string>;
    onError?: (error: Error) => void;
    onSuccess?: (data: UploadMediaResponseType) => void;
}

/** Uploads a single file with the signed-in user's token and validates the response. */
export const useUploadFile = ({ endpoint = "/uploads", formFields, onError, onSuccess }: UseUploadFileOptions = {}) => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = useCallback(
        async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            Object.entries(formFields ?? {}).forEach(([key, value]) => formData.append(key, value));

            setIsUploading(true);
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    body: formData,
                    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    method: "POST",
                });
                const body: unknown = await response.json().catch(() => null);
                if (!response.ok) throw new Error((body as { message?: string } | null)?.message ?? "Upload failed");
                onSuccess?.(UploadMediaResponseSchema.parse(body));
            } catch (error) {
                onError?.(error instanceof Error ? error : new Error("Upload failed"));
            } finally {
                setIsUploading(false);
            }
        },
        [endpoint, formFields, onError, onSuccess]
    );

    return { isUploading, uploadFile };
};
