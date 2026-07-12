import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { height: 36, width: 53 },
  md: { height: 40, width: 59 },
  lg: { height: 56, width: 83 },
} as const;

type BrandLogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
};

export function BrandLogo({ size = "md", className }: BrandLogoProps) {
  const { width, height } = SIZES[size];

  return (
    <span className={cn("relative inline-block", className)} style={{ width, height }}>
      <Image
        src="/logo-awf-light.png"
        alt="Almir Wedding Films"
        width={width}
        height={height}
        className="h-full w-full object-contain dark:hidden"
        priority
      />
      <Image
        src="/logo-awf-dark.png"
        alt="Almir Wedding Films"
        width={width}
        height={height}
        className="hidden h-full w-full object-contain dark:block"
        priority
      />
    </span>
  );
}
