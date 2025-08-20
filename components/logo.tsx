import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
  className?: string;
}

export function Logo({ size = "md", variant = "default", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textColor = variant === "white" 
    ? "text-white" 
    : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${textColor} ${className}`}>
      <Sparkles className={iconSizes[size]} />
      <span className="tracking-wide">SkiTripPlanner</span>
    </div>
  );
}
