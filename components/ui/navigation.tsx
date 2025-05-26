import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const Navigation: React.FC<{
  icon?: ReactNode;
  children: ReactNode;
  subComponent?: ReactNode;
  className?: string;
}> = ({ icon, children, className, subComponent }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-16 py-14 text-body-m font-semibold text-nobleBlack-100",
        className
      )}
    >
      <div className="flex items-center gap-16">
        {icon}
        {children}
      </div>
      {subComponent}
    </div>
  );
};

export default Navigation;
