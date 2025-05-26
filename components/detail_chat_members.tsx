import { useState, useEffect } from "react";
import { AvatarHasStatus } from "./ui";
import { calculateTimeAgo, stateUser } from "@/lib/utils";
import User from "./interface/User";

const DetailChatMembers = ({
  members,
  self,
  currentNav,
}: {
  members: any;
  self: User | null;
  currentNav: string;
}) => {
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [offlineMembers, setOfflineMembers] = useState([]);

  useEffect(() => {
    console.log(members)
    const onlineMembers = members.filter((member: any) => member.status === 1 && member.online === true);
    const offlineMembers = members.filter((member: any) => member.status === 0 || !member.online);
    console.log(onlineMembers)
    console.log(offlineMembers)
    setOnlineMembers(onlineMembers);
    setOfflineMembers(offlineMembers);
  }, [members]);
  return (
    <div className="flex flex-col gap-24">
      {onlineMembers.length > 0 && (
        <div className="flex flex-col gap-24">
          <div className="flex items-center gap-8 font-semibold text-body-s text-nobleBlack-300">
            <span className="flex-1">Current Online</span>
            <span className="text-body-s font-semibold text-nobleBlack-400">
              {onlineMembers.length}
            </span>
          </div>
          <ul className="flex flex-col gap-24">
            {onlineMembers.map((member: any) => (
              <li key={member.id} className="p-12 flex items-center gap-24">
                <AvatarHasStatus
                  className="rounded-20"
                  src="/assets/avatars/Benjamin Kim.png"
                  status={
                    self?.id === member.id
                      ? stateUser(true, member?.status)
                      : stateUser(member.is_joined, member.status)
                  }
                />
                <div className="flex flex-col gap-4">
                  <span className="text-body-l font-semibold text-white">
                    {member.name}
                  </span>
                  {member.id === self?.id ? (
                    <span className="text-body-s font-medium text-nobleBlack-300">
                      Exploring{" "}
                      <span className="font-semibold text-dayBlue-500">
                        {currentNav}
                      </span>
                    </span>
                  ) : member.is_joined ? (
                    <span className="text-body-s font-medium text-nobleBlack-300">
                      Exploring{" "}
                      <span className="font-semibold text-dayBlue-500">
                        {member.navigation_current ?? ""}
                      </span>
                    </span>
                  ) : (
                    <span className="text-body-s font-medium text-nobleBlack-300">
                      <span className="font-semibold text-happyOrange-600">
                        Away{" "}
                      </span>
                      for {calculateTimeAgo(member.updated_at, true).timeAgo}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {offlineMembers.length > 0 && (
        <div className="flex flex-col gap-24">
          <div className="flex items-center gap-8 font-semibold text-body-s text-nobleBlack-300">
            <span className="flex-1">Offline</span>
            <span className="text-body-s font-semibold text-nobleBlack-400">
              {offlineMembers.length}
            </span>
          </div>
          <ul className="flex flex-col gap-24">
            {offlineMembers.map((member: any) => (
              <li key={member.id} className="p-12 flex items-center gap-24">
                <AvatarHasStatus
                  className="rounded-20"
                  src="/assets/avatars/Benjamin Kim.png"
                  status={stateUser(member.user_status, member.status, member.not_disturb, member.online)}
                />
                <div className="flex flex-col gap-4">
                  <span className="text-body-l font-semibold text-white">
                    {member.name}
                  </span>
                  <span className="text-body-s font-medium text-nobleBlack-300">
                    Last visit:{" "}
                    {calculateTimeAgo(member.updated_at, true).timeAgo}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailChatMembers;
