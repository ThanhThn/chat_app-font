"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Divider } from "@/components/ui";
import Icon from "@/components/icon";
import { LinkShape } from "@/components/icon/symbol/link";
import Call from "@/components/Call";
import { AgoraRTCProvider } from "agora-rtc-react";
import { client } from "@/lib/agora";
import { useRouter } from "next/navigation";
import { database, sendData } from "@/lib/firebase";
import { increment, onDisconnect, ref, remove } from "firebase/database";
import { nameSaveToken } from "@/config/api";

const VideoCall: React.FC = () => {
  const [project, setProject] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const channelData = localStorage.getItem("channel");
    const projectData = localStorage.getItem("project");
    const token = localStorage.getItem(nameSaveToken);

    if (!user || !channelData || !projectData || !token) {
      router.push("/");
      return;
    }
    const channel = JSON.parse(channelData);
    const userData = JSON.parse(user);
    const userRef = ref(database, `${channel.id}/${userData.id}`);
    onDisconnect(userRef).remove();
    setToken(token);
    sendData(`${channel.id}/${userData.id}`, userData);
    setUser(userData);
    setChannel(channel);
    setProject(JSON.parse(projectData)); 
    return () => {remove(userRef)};
  }, []);

  return (
    <div className="h-full max-h-dvh w-full p-12 flex gap-12 relative flex-col">
      <div className="top-bar rounded-20 bg-nobleBlack-800">
        <div className="heading p-24 flex justify-between items-center">
          <div className="project-name flex flex-col gap-4">
            <h4 className="text-heading-xs font-bold">
              {project?.name_project}
            </h4>
            <p className="text-body-m font-medium text-nobleBlack-300">
              {project?.description_project}
            </p>
          </div>
          <div className="flex gap-8 rounded-full bg-stemGreen-500 py-8 px-12 h-40">
            <Icon icon={LinkShape} className="text-dayBlue-900" />
            <Divider className="w-1.5 rounded-full overflow-hidden h-full bg-nobleBlack-600 flex-col" />
            <div className="text-dayBlue-900 font-semibold text-body-l truncate">
              {channel?.name}
            </div>
          </div>
        </div>
      </div>
      {channel && (
        <AgoraRTCProvider client={client}>
          <Call
            token={token}
            router={router}
            channel={channel.id}
            user={user}
          />
        </AgoraRTCProvider>
      )}
    </div>
  );
};

export default VideoCall;
