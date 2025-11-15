import React from "react";
import { LoaderIcon } from "lucide-react";

// Simple className merging utility
const cn = (...classes) => classes.filter(Boolean).join(' ');

const PageLoader = ({
  size = "md",
  text = "Loading...",
  className,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-10",
    lg: "size-14",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Overlay Full-Screen Loader
  if (overlay) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <div className={cn("flex flex-col items-center gap-4", className)}>
          <LoaderIcon
            className={cn("animate-spin text-primary", sizeClasses[size])}
          />
          {text && (
            <p
              className={cn(
                "text-muted-foreground font-medium",
                textSizes[size]
              )}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Normal Loader
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("min-h-screen flex items-center justify-center", className)}
    >
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon
          className={cn("animate-spin text-primary", sizeClasses[size])}
        />
        {text && (
          <p
            className={cn(
              "text-muted-foreground font-medium",
              textSizes[size]
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
