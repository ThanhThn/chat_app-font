import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";


const BadgeEllipseLargeVariant = cva(
  "absolute w-40 h-40 rounded-full -z-10 bottom-0 translate-y-1/2 right-full translate-x-1/2 blur",
  {
    variants: {
      variant: {
        "Day-Blue": "bg-dayBlue-300/16",
        "Stem-Green": "bg-stemGreen-500/16",
        "Heisenberg-Blue": "bg-heisenbergBlue-500/16",
        "Happy-Orange": "bg-happyOrange-600/16",
        "Electric-Green": "bg-electricGreen-600/16",
        "Red-Power": "bg-redPower-600/16",
        "Purple-Blue": "bg-purpleBlue-400/16",
        Sunglow: "bg-sunglow-500/16"
      },
    },
  }
);
const BadgeEllipseSmallVariant = cva(
  "absolute w-22 h-22 rounded-full -z-10 bottom-full translate-y-1/2 right-0 translate-x-1/2 blur-lg",
  {
    variants: {
      variant: {
        "Day-Blue": "bg-dayBlue-300/24",
        "Stem-Green": "bg-stemGreen-500/24",
        "Heisenberg-Blue": "bg-heisenbergBlue-500/24",
        "Happy-Orange": "bg-happyOrange-600/24",
        "Electric-Green": "bg-electricGreen-600/24",
        "Red-Power": "bg-redPower-600/24",
        "Purple-Blue": "bg-purpleBlue-400/24",
        Sunglow: "bg-sunglow-500/24"
      },
    },
  }
);

const BadgeVariant = cva(
  "px-12 py-7 rounded-12 text-body-s font-semibold bg-glass-fill border-t-1 border-white/8 overflow-hidden relative",
  {
    variants: {
      variant: {
        "Day-Blue": "text-dayBlue-300",
        "Stem-Green": "text-stemGreen-500",
        "Heisenberg-Blue": "text-heisenbergBlue-500",
        "Happy-Orange": "text-happyOrange-600",
        "Electric-Green": "text-electricGreen-600",
        "Red-Power": "text-redPower-600",
        "Purple-Blue": "text-purpleBlue-400",
        Sunglow: "text-sunglow-500"
      },
    },
  }
);

const Badge: React.FC<{
  variant:
    | "Day-Blue"
    | "Stem-Green"
    | "Heisenberg-Blue"
    | "Happy-Orange"
    | "Electric-Green"
    | "Red-Power"
    | "Purple-Blue"
    | "Sunglow";
  className?: string;
  children: ReactNode;
}> = ({ variant, className, children }) => {
  const variants = {};
  return (
    <div className={cn(BadgeVariant({ variant, className }))}>
      <div className={cn(BadgeEllipseLargeVariant({variant, className}))}></div>
      {children}
      <div
        className={cn(BadgeEllipseSmallVariant({variant, className}))}
      ></div>
    </div>
  );
};

export default Badge;
