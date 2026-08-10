import { baseURL } from "@/config/constants";

const getUploadBaseUrl = () => {
    const configuredBase =
        process.env.NEXT_PUBLIC_UPLOADS_BASE_URL ||
        process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
        baseURL ||
        "";

    return configuredBase.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export function getImageUrl(src?: string | File | null): string | undefined {
    if (!src) return undefined;

    if (typeof src === "string") {
        const trimmedSrc = src.trim();
        if (!trimmedSrc) return undefined;

        const isFileObjectUrl = trimmedSrc.startsWith("blob:");
        const isAbsoluteUrl = trimmedSrc.startsWith("http");
        const fileUrl = trimmedSrc.startsWith("/uploads") || trimmedSrc.startsWith("uploads/");
        const isPublicPath = trimmedSrc.startsWith("/");

        if (fileUrl) {
            return `${getUploadBaseUrl()}/${trimmedSrc.replace(/^\/+/, "")}`;
        } else if (isPublicPath) {
            return trimmedSrc;
        } else if (!isFileObjectUrl && !isAbsoluteUrl) {
            return `${getUploadBaseUrl()}/${trimmedSrc.replace(/^\/+/, "")}`;
        } else {
            return trimmedSrc;
        }
    }

    if (src instanceof File) {
        return URL.createObjectURL(src);
    }

    return undefined;
}
