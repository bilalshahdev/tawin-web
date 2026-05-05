import { Loader2 } from "lucide-react";

interface SpinnerLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const SpinnerLoader = ({ className = "", size = "lg" }: SpinnerLoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};
