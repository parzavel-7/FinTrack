import Link from "next/link";

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
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className={`${sizes[size]} `}>
          <img
            src="/logo.png"
            alt="FinTrack"
            className="object-contain h-full w-full"
          />
        </div>
        <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight`}>
          <span className="text-white">Fin</span>
          <span style={{ color: "#8A5AD4" }}>Track</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
