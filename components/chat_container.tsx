import User from "./interface/User";
import { AvatarHasStatus, Badge, Button, Chat, Divider } from "./ui";
import urlBase, { nameSaveToken } from "@/config/api";
import echo from "@/lib/echo";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ChatContent from "./chat_content";
import ChatChannel from "./chat_channel";

interface ChatContainerProps {
  users: any;
  user: User | null;
  project: any;
  showChat: boolean;
  onShowDetailChat: () => void;
  publicChannel: any;
  privateChannel: any;
  channelActive: any;
  onSetChannelActive: (channel: any) => void;
  fetchChannel: () => Promise<void>;
  messages: any;
  onSetMessages: (messages: any) => void;
  onLoadMessage: () => void;
  onModal: (modalData: any) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
      users,
      user,
      project,
      showChat,
      onShowDetailChat,
      publicChannel,
      privateChannel,
      channelActive,
      onSetChannelActive,
      fetchChannel,
      messages,
      onSetMessages,
      onLoadMessage,
      onModal
    }
  ) => {
    const token = localStorage.getItem(nameSaveToken);

    return (
      <div className="flex gap-32 flex-1 overflow-y-hidden h-full">
        {showChat ? (
          <>
            <ChatContent
              users={users}
              user={user}
              project={project}
              channelActive={channelActive}
              onShowDetailChat={onShowDetailChat}
              messages={messages}
              onSetMessages={(messages: any) => onSetMessages(messages)}
              onLoadMessage={onLoadMessage}
              onModal={onModal}
              token={token}
            />
          </>
        ) : (
          <ChatChannel
            project={project}
            token={token}
            onClick={(channel: any) => onSetChannelActive(channel)}
            publicChannel={publicChannel}
            privateChannel={privateChannel}
            fetchChannel={fetchChannel}
          />
        )}
      </div>
    );
  } 

export default ChatContainer;
