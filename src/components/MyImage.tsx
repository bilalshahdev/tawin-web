"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image, { ImageProps, StaticImageData } from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | File | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
}

const LOADED_IMAGE_CACHE = new Set<string>();

const normalizeUrl = (url: string) => {
  return url.replace(/([^:]\/)\/+/g, "$1");
};

const MyImage = ({
  src,
  alt,
  className,
  fallbackSrc = "/fallback.png",
  fallbackText,
  fill,
  ...rest
}: MyImageProps) => {
  let resolvedSrc = getImageUrl(src as string | File | null);

  if (typeof resolvedSrc === "string") {
    resolvedSrc = normalizeUrl(resolvedSrc);
  }

  const srcKey = typeof resolvedSrc === "string" ? resolvedSrc : "";
  const isAlreadyLoaded = srcKey ? LOADED_IMAGE_CACHE.has(srcKey) : false;

  const [isLoading, setIsLoading] = useState(!isAlreadyLoaded);
  const [isError, setIsError] = useState(!src);

  useEffect(() => {
    if (srcKey && LOADED_IMAGE_CACHE.has(srcKey)) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    setIsError(!src);
  }, [srcKey, src]);

  if (isError || !resolvedSrc) {
    if (fallbackText) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-200 text-gray-600 font-medium",
            className,
          )}
        >
          {fallbackText}
        </div>
      );
    }

    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        fill={fill}
        className={cn("object-cover", className)}
        {...rest}
      />
    );
  }

  const imageEl = (
    <>
      {isLoading && (
        <div
          className={cn(
            "animate-shimmer z-10",
            fill
              ? "absolute inset-0 w-full h-full"
              : "absolute inset-0 w-full h-full"
          )}
        />
      )}
      <Image
        src={resolvedSrc as string}
        alt={alt}
        fill={fill}
        className={cn(
          "object-cover",
          !isAlreadyLoaded && "transition-opacity duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={() => {
          if (srcKey) LOADED_IMAGE_CACHE.add(srcKey);
          setIsLoading(false);
        }}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </>
  );

  // fill mode: parent already has position:relative — don't add extra div
  if (fill) {
    return imageEl;
  }

  // non-fill mode: need relative wrapper so shimmer can absolute-position inside
  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="animate-shimmer absolute inset-0 w-full h-full z-10" />
      )}
      <Image
        src={resolvedSrc as string}
        alt={alt}
        className={cn(
          "object-cover w-full h-full",
          !isAlreadyLoaded && "transition-opacity duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoadingComplete={() => {
          if (srcKey) LOADED_IMAGE_CACHE.add(srcKey);
          setIsLoading(false);
        }}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </div>
  );
};

export default MyImage;