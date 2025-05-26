import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import Icon from "./icon";
import { CheckCircle, Error, Warning } from "./icon/symbol";

const Notification: React.FC<{
  id: string;
  type: "success" | "warning" | "error";
  message: string;
  onNotifications: (notifications: (prev: { id: string }[]) => { id: string }[]) => void;
}> = ({ id, type, message, onNotifications }) => {
  const contextType = {
    success: {
      icon: CheckCircle,
      text: "Success! ",
      classIcon: "success_icon",
    },
    warning: {
      icon: Warning,
      text: "Warning! ",
      classIcon: "warning_icon",
    },
    error: {
      icon: Error,
      text: "Something went wrong. ",
      classIcon: "error_icon",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
    return () => clearTimeout(timer);
  }, [id, onNotifications]);

  return (
    <div
      className={cn(
        "bg-nobleBlack-800 rounded-8 px-16 py-12 text-body-s font-semibold flex gap-16 items-center animate-notify"
      )}
    >
      <Icon
        icon={contextType[type].icon}
        className={cn(`${contextType[type].classIcon}`)}
      />
      <div>
        <span className={cn(`${type}`)}>{contextType[type].text}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
