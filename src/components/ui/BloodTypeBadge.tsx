// BloodTypeBadge — reusable blood type pill
// Thinzar Kyaw — Frontend Domain

import { clsx } from "clsx";

interface BloodTypeBadgeProps {
  bloodType: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BloodTypeBadge = ({
  bloodType,
  size = "md",
  className,
}: BloodTypeBadgeProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-xl bg-vr-navy font-bold text-white",
        sizeClasses[size],
        className
      )}
    >
      {bloodType}
    </div>
  );
};
