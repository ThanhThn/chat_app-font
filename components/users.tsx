import React, { useEffect } from "react";
import { AvatarHasStatus } from "./ui";
import { cn, stateUser } from "@/lib/utils";

const Users: React.FC<{
  users: any[];
  self: any;
  limit: number;
  className?: string;
  onClick?: () => void;
}> = ({ users, self , limit, className, onClick }) => {
  const usersHidden = users.length - limit;
  return (
    <div className={cn("flex -space-x-9  items-center cursor-pointer", className)} onClick={onClick}>
      {users.slice(0, limit).map((user, index) => {
        return (
          <AvatarHasStatus
            className={cn("w-40 h-40 rounded-12 ")}
            classNameAvatar="border-4 border-nobleBlack-800 !rounded-12"
            key={index}
            src={`/assets/avatars/Andrew Garcia.png`}
            status={user.id === self.id ? stateUser(true, user.status) : stateUser(user.is_joined, user.status, user.not_disturb, user.online)}
            style={{ zIndex: users.length - index }}
          />
        );
      })}
      {usersHidden > 0 && (
        <div className="text-body-s font-semibold text-nobleBlack-400 bg-nobleBlack-600 rounded-12 w-32 text-center h-32 flex items-center justify-center cursor-pointer relative z-0">
          <span>{`+${usersHidden}`}</span>
        </div>
      )}
    </div>
  );
};

export default Users;
