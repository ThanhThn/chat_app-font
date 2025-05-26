import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TextGradient: React.FC<{
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
}> = ({ tag: Tag = "div", className = "", children }) => {
  return <Tag className={cn('text-transparent bg-clip-text', className)}>{children}</Tag>;
};

export default TextGradient;
