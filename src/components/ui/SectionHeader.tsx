// SectionHeader — uppercase label used throughout the app
// Thinzar Kyaw — Frontend Domain

import { clsx } from "clsx";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return (
    <h2
      className={clsx(
        "text-xs font-bold tracking-widest text-gray-500 uppercase",
        className
      )}
    >
      {children}
    </h2>
  );
};
