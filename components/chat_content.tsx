import React, { useEffect, useState, useCallback } from "react";
import { cn, stateUser } from "@/lib/utils";
import Icon from "./icon";
import { Camera, Copy, Share } from "./icon/active";
import { Dots, InfoCircle, Star } from "./icon/symbol";
import { AvatarHasStatus, Button, Divider, Badge, Chat } from "./ui";
import { calculateTimeAgo } from "@/lib/utils";
import ContextMessage from "./ui/context_message";
import config from "@/config/constant/constant";
import urlBase from "@/config/api";
import { useRouter } from "next/navigation";
import { client, joinChannelAgora } from "@/lib/agora";
import { getData, onChange } from "@/lib/firebase";
import { channel } from "diagnostics_channel";

const ChatContent = ({
  users,
  user,
  project,
  channelActive,
  onShowDetailChat,
  messages,
  onSetMessages,
  token,
  onModal
}: {
  users: Array<any>;
  user: any;
  project: any;
  channelActive: any;
  onShowDetailChat: any;
  messages: any;
  onSetMessages: any;
  onLoadMessage: any;
  token: string | null;
  onModal: (modalData: any) => void;
}) => {
  const [auth, setAuth] = useState<number | undefined>();
  const [hasCall, setHasCall] = useState(false);
  const [loadingCall, setLoadingCall] = useState(false);
  const route = useRouter();

  let todayDividerShown = false;
  const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(text);
  };

  const handleJoinCall = useCallback(async () => {
    localStorage.setItem("channel", JSON.stringify(channelActive));
    localStorage.setItem("project", JSON.stringify(project));
    localStorage.setItem("user", JSON.stringify(user));
    route.push("call");
  }, [token, user.id, channelActive.id, route]);

  const handleDeleteMessage = useCallback(async (messageId : string) => {
      const res = await fetch(`${urlBase}/api/message/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message_id: messageId,
          project_id: project.id,
          channel_id: channelActive.id
        })
      })

      if(res.ok){
        onSetMessages((prev: any[]) => prev.filter(item => item.id !== messageId));
      }
  }, [
    channelActive, project, token
  ])

  useEffect(() => {
    if (!channelActive) {
      return;
    }
    const connect = channelActive.connects.find(
      (connect: any) => connect.user_id === user.id
    );
    setAuth(connect?.role);
  }, [channelActive]);

  useEffect(() => {
    const fetchData = async () => {
      onChange(channelActive.id, (snapshot) => {
        setHasCall(!!snapshot.val());
      });
    };
    fetchData();

    return () => {};
  }, [channelActive]);

  return (
    <div className="flex-1 overflow-y-hidden h-full flex flex-col">
      <header className="flex items-center justify-between py-8">
        <div className="project-name flex items-center gap-16">
          <h4 className="text-heading-xs font-bold">{channelActive?.name}</h4>
          <Badge
            variant={
              channelActive?.type === "public"
                ? "Stem-Green"
                : "Heisenberg-Blue"
            }
            className="h-32 w-32 p-0 flex justify-center items-center size-text-body-s"
          >
            {channelActive?.connects.length}
          </Badge>
        </div>
        <div className="gap-16 flex">
          <Button
            variant="ghost"
            className="w-48 h-48 p-0"
            disabled={loadingCall}
            onClick={handleJoinCall}
          >
            <Icon
              icon={Camera}
              className={cn(
                "",
                hasCall &&
                  "text-stemGreen-500 drop-shadow-multiple-stemGreen-500/30"
              )}
            />
          </Button>
          <Button variant="ghost" className="w-48 h-48 p-0" onClick={() => onModal('channel')}>
            <Icon icon={Share} />
          </Button>
          <Button
            variant="ghost"
            className="w-48 h-48 p-0"
            onClick={onShowDetailChat}
          >
            <Icon icon={Dots} />
          </Button>
        </div>
      </header>
      <div className="chat flex flex-1 flex-col gap-20 relative before:content-[''] before:absolute before:w-full before:h-28 before:top-0 before:left-0 before:bg-gradient-to-t before:from-nobleBlack-700/0 before:to-nobleBlack-700 overflow-y-hidden">
        <div className="flex flex-col-reverse overflow-y-auto no-scrollbar h-full">
          <ul className="flex flex-col gap-20">
            {messages.map((message: any, index: any) => {
              const { timeAgo, isTodayMessage } = calculateTimeAgo(
                message.created_at
              );
              const sender = users.find(
                (user: any) => user.id == message.user_id
              );
              const showToday = isTodayMessage && !todayDividerShown;
              if (showToday) {
                todayDividerShown = true;
              }

              return (
                <React.Fragment key={index}>
                  {showToday && (
                    <li>
                      <Divider
                        text="Today"
                        className="text-nobleBlack-300"
                        classLine="bg-nobleBlack-700"
                      />
                    </li>
                  )}

                  <li className="p-16 flex gap-24 items-start rounded-16 border-1 border-nobleBlack-600 hover:bg-nobleBlack-800 hover:border-nobleBlack-800 group transition-all overflow-hidden">
                    <AvatarHasStatus
                      src="/assets/avatars/Benjamin Kim.png"
                      status={stateUser(sender.is_joined, sender.status)}
                    />
                    <div className="content-chat py-8 flex-1 flex flex-col gap-24">
                      <div className="flex gap-12 flex-col">
                        <header className="flex justify-between gap-16">
                          <div className="name flex items-center gap-16 flex-1">
                            <span className="text-body-l font-semibold truncate w-fit">
                              {message.user_id === user?.id
                                ? "Me"
                                : sender.name}
                            </span>
                            <span className="text-body-s font-medium truncate text-nobleBlack-400">
                              {timeAgo}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-32 h-32 p-0 group"
                            onClick={() => copyTextToClipboard(message.context.text)}
                          >
                            <Icon
                              icon={Copy}
                              className="group-hover:text-nobleBlack-200"
                            />
                          </Button>
                        </header>
                        <ContextMessage message={message.context} />
                      </div>
                      <div className="action hidden group-hover:flex gap-12">
                        <Button
                          className="rounded-8 px-12 h-32 text-body-s font-semibold"
                          variant="tertiary"
                        >
                          Reply
                        </Button>
                        {(auth == config("auth.owner") ||
                          message.user_id === user?.id) && (
                          <Button
                            className="rounded-8 px-12 h-32 text-body-s font-semibold"
                            variant="tertiary"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            Recall
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
        {auth === config("auth.owner") || auth === config("auth.editor") ? (
          <Chat
            update_message={onSetMessages}
            project_id={project.id}
            channel_id={channelActive.id}
            className="p-24 gap-24"
            name=""
            onChange={() => {}}
            placeHolder="What you want to share today?"
          />
        ) : (
          <div className="p-24 bg-nobleBlack-800 rounded-16 flex items-center gap-16">
            <Icon
              icon={InfoCircle}
              className="text-dayBlue-500 drop-shadow-multiple-dayBlue-500/30"
            />
            <p className="text-body-l font-semibold text-nobleBlack-200">
              You are not authorized to send messages in this channel
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContent;
