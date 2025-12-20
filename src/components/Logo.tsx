import { Link } from "react-router-dom";
import { Database } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className={`${sizes[size]} rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300`}>
          <Database className="text-primary-foreground" size={size === "sm" ? 14 : size === "md" ? 18 : 22} />
        </div>
        <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-foreground tracking-tight`}>
          FinTrack
        </span>
      )}
    </Link>
  );
};

export default Logo;
