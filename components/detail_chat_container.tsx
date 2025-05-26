import { useState } from "react";
import DetailChatChannel from "./detail_chat_channel";
import DetailChatMembers from "./detail_chat_members";
import Icon from "./icon";
import { Chat, Users } from "./icon/symbol";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import User from "./interface/User";

const DetailChatContainer = ({publicChannels, privateChannels, members, channelActive, onSetChannelActive, showDetailChat, activeTab, onActiveTab, self, currentNav}: {publicChannels: any, privateChannels: any, members: any, channelActive: any, onSetChannelActive: any, showDetailChat: boolean, activeTab: "chat" | "members", onActiveTab: (tab: "chat" | "members") => void, self: User | null, currentNav: string}) => {

    const tabs = [
        {
            label: "Chats",
            icon: Chat,
            value: "chat",
            direction: "ltr",
            component: <DetailChatChannel publicChannel={publicChannels} privateChannel={privateChannels} channelActive={channelActive} users={members} onSetChannelActive={onSetChannelActive} self={self}/>,
        },
        {
            label: "Members",
            icon: Users,
            value: "members",
            direction: "rtl",
            component: <DetailChatMembers members={members} self={self} currentNav={currentNav}/>,
        },
    ];
    return (
        <div className={cn("w-[26rem] flex-col gap-16", showDetailChat ? "flex" : "hidden")}>
            <div className="flex-1 px-24 overflow-hidden">
                <div className="overflow-y-auto h-full pb-20 no-scrollbar">
                    {tabs.find((tab) => tab.value === activeTab)?.component}
                </div>
            </div>
            <div className="flex w-full items-center justify-between rounded-12 border-1 border-nobleBlack-600 relative before:content-[''] before:absolute before:w-full before:h-100 before:bottom-full before:left-0 before:bg-gradient-to-b before:from-nobleBlack-700/0 before:to-nobleBlack-700">
                {tabs.map((tab) => (
                    <Button variant={activeTab === tab.value ? "tertiary" : "ghost"} className="flex-1 flex items-center gap-12" key={tab.label} onClick={() => onActiveTab(tab.value as "chat" | "members")}>
                        {tab.direction === "ltr" ? (
                            <>
                                <Icon icon={tab.icon} className={cn(activeTab === tab.value ? "text-stemGreen-500 drop-shadow-multiple-stemGreen-500/30" : "")} />
                                <span className={cn("text-body-l font-semibold", activeTab === tab.value ? "text-nobleBlack-100" : "text-nobleBlack-300")}>{tab.label}</span>
                            </>
                        ) : (
                            <>
                                <span className={cn("text-body-l font-semibold", activeTab === tab.value ? "text-nobleBlack-100" : "text-nobleBlack-300")}>{tab.label}</span>
                                <Icon icon={tab.icon} className={cn(activeTab === tab.value ? "text-stemGreen-500 drop-shadow-multiple-stemGreen-500/30" : "")} />
                            </>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default DetailChatContainer;