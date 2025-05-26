import React, { ReactNode } from "react";
import StatusActive from "./status-active";
import { OperationalStatus } from "../state";
import { cn } from "@/lib/utils";

const Avatar: React.FC<{
  className?: string;
  classNameAvatar?: string;
  children?: ReactNode;
  src: string;
  alt?: string;
  style?: any
}> = ({ className, classNameAvatar, children, src, alt = "", style }) => {
  return (
    <div style={style}  className={cn("w-48 h-48 rounded-full", className)}>
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover rounded-20", classNameAvatar)}
      />
      {children}
    </div>
  );
};

const AvatarHasStatus: React.FC<{
  className?: string;
  classNameStatus?: string;
  classNameAvatar?: string;
  src: string;
  alt?: string;
  style?: any
  status: OperationalStatus;
}> = ({
  className = "",
  classNameStatus,
  classNameAvatar,
  src,
  alt = "",
  status,
  style
}) => {
  return (
    <Avatar
      src={src}
      alt={alt}
      className={cn("relative", className)}
      classNameAvatar={classNameAvatar}
      style = {style}
    >
      <StatusActive
        className={cn(
          "absolute top-5 -translate-y-1/2 right-5 translate-x-1/2 ",
          classNameStatus
        )}
        status={status}
      />
    </Avatar>
  );
};

export default Avatar;
export { AvatarHasStatus };
