import React, { useState } from "react";
import Icon, { IIcon } from "../icon";
import { cn } from "@/lib/utils";

const Tab: React.FC<{
  icon?: React.ElementType<IIcon>;
  text: string;
  active: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon: IconComponent, text, active, className, onClick }) => {
  return (
    <button className={cn("relative", className)} onClick={onClick}>
      <div
        className={cn(
          "font-semibold text-body-m flex gap-12 px-8 items-center justify-center",
          active ? "text-nobleBlack-100" : "text-nobleBlack-300"
        )}
      >
        {IconComponent && (
          <IconComponent
            className={cn(active && "text-stemGreen-500 drop-shadow-multiple-stemGreen-500/30")}
          />
        )}
        {text}
      </div>
      {
        active && <div className="w-full h-3 bg-stemGreen-500 absolute bottom-0 rounded-t-full"></div>
      }
      
    </button>
  );
};

export default Tab;
