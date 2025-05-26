import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Button: React.FC<{
  tag?: "button" | "div"
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "tertiary" | "ghost" | "glass";
  borderWidth?: number;
  disabled?: boolean
  onClick?: React.MouseEventHandler<any>
}> = ({ className, children, type = "button", variant = "default", onClick, disabled, tag="button" }) => {
  const variants = {
    ["default"]:
      "bg-stemGreen-500 text-dayBlue-900 hover:bg-stemGreen-400 active:bg-stemGreen-300",
    ["outline"]:
      "border-stemGreen-500 bg-transparent text-stemGreen-500 border-3 hover:border-stemGreen-400 active:border-stemGreen-300 text:border-stemGreen-400 text:border-stemGreen-300",
    ["tertiary"]:
      "bg-nobleBlack-600 hover:bg-nobleBlack-500 active:bg-nobleBlack-400 text-nobleBlack-300 hover:text-nobleBlack-200 active:text-nobleBlack-100 ",
    ["ghost"]: "bg-transparent text-dayBlue-900",
    ["glass"]: "bg-glass-fill border-t-1 border-glass shadow-glass-effect"
  };
  const Tag = tag
  return (
    <Tag
      disabled={disabled}
      type={type}
      onClick={onClick} 
      className={cn(
        `rounded-12 h-48 py-8 px-24 text-body-l font-semibold flex items-center justify-center gap-12`,
        variants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Button;
