/**
 * Types of files that can be validated
 */
export type FileType =
    | "image"
    | "pdf"
    | "document"
    | "spreadsheet"
    | "presentation"
    | "archive";

/**
 * Options for file validation
 */
export interface FileValidationOptions {
    /**
     * Maximum file size in bytes
     */
    maxSize?: number;
    /**
     * Allowed file extensions (without the dot)
     */
    allowedExtensions?: string[];
}

/**
 * Result of file validation
 */
export interface ValidationResult {
    /**
     * Whether the file is valid according to the validation criteria
     */
    isValid: boolean;
    /**
     * Error message if validation failed
     */
    error?: string;
    /**
     * Type of file that was detected
     */
    detectedType?: FileType;
}

const DEFAULT_IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
];
const DEFAULT_PDF_EXTENSIONS = ["pdf"];
const DEFAULT_DOCUMENT_EXTENSIONS = ["doc", "docx", "txt", "rtf", "odt"];
const DEFAULT_SPREADSHEET_EXTENSIONS = ["xls", "xlsx", "csv", "ods"];
const DEFAULT_PRESENTATION_EXTENSIONS = ["ppt", "pptx", "odp"];
const DEFAULT_ARCHIVE_EXTENSIONS = ["zip", "rar", "7z", "tar", "gz"];

const DEFAULT_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Gets the file extension from a file name
 */
export const getFileExtension = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "";
};

/**
 * Formats a file size in bytes to a human-readable MB string with fixed decimal places
 * @param file The file to calculate size for
 * @param decimalPlaces Number of decimal places to show (default: 2)
 * @returns File size in MB as a string
 */
export const getFileSizeInMB = (
    file: File,
    decimalPlaces: number = 2
): string => {
    const sizeInMB = file.size / (1024 * 1024);
    return sizeInMB.toFixed(decimalPlaces);
};

/**
 * Validates if a file is an image
 * @param file The file to validate
 * @param options Validation options
 * @returns Validation result
 */
export const isImageFile = (
    file: File,
    options: FileValidationOptions = {}
): ValidationResult => {
    const {
        maxSize = DEFAULT_MAX_IMAGE_SIZE,
        allowedExtensions = DEFAULT_IMAGE_EXTENSIONS,
    } = options;

    // Check file size
    if (file.size > maxSize) {
        return {
            detectedType: "image",
            error: `File size exceeds the maximum allowed size of ${(maxSize / (1024 * 1024)).toFixed(2)}MB`,
            isValid: false,
        };
    }

    // Check file extension
    const extension = getFileExtension(file.name);
    if (!allowedExtensions.includes(extension)) {
        return {
            detectedType: "image",
            error: `File type not allowed. Allowed image types: ${allowedExtensions.join(", ")}`,
            isValid: false,
        };
    }

    // Check MIME type
    if (!file.type.startsWith("image/")) {
        return {
            detectedType: "image",
            error: "Invalid image file",
            isValid: false,
        };
    }

    return {
        detectedType: "image",
        isValid: true,
    };
};

/**
 * Detects the type of file based on its extension and MIME type
 * @param file The file to check
 * @returns The detected file type
 */
export const detectFileType = (file: File): FileType => {
    const extension = getFileExtension(file.name);

    if (
        DEFAULT_IMAGE_EXTENSIONS.includes(extension) ||
        file.type.startsWith("image/")
    ) {
        return "image";
    }

    if (
        DEFAULT_PDF_EXTENSIONS.includes(extension) ||
        file.type === "application/pdf"
    ) {
        return "pdf";
    }

    if (
        DEFAULT_DOCUMENT_EXTENSIONS.includes(extension) ||
        file.type.includes("document") ||
        file.type.includes("text/")
    ) {
        return "document";
    }

    if (
        DEFAULT_SPREADSHEET_EXTENSIONS.includes(extension) ||
        file.type.includes("spreadsheet") ||
        file.type.includes("excel")
    ) {
        return "spreadsheet";
    }

    if (
        DEFAULT_PRESENTATION_EXTENSIONS.includes(extension) ||
        file.type.includes("presentation") ||
        file.type.includes("powerpoint")
    ) {
        return "presentation";
    }

    if (
        DEFAULT_ARCHIVE_EXTENSIONS.includes(extension) ||
        file.type.includes("zip") ||
        file.type.includes("archive")
    ) {
        return "archive";
    }

    return "document"; // Default fallback
};
