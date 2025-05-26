import { stateUser } from "@/lib/utils";
import Icon from "./icon";
import { ChevronDown, Globe, PadLock } from "./icon/symbol";
import { Badge, Divider } from "./ui";
import { AvatarHasStatus } from "./ui/avatar";
import { useState } from "react";
import User from "./interface/User";

const DetailChatChannel = ({publicChannel, privateChannel, channelActive, users, onSetChannelActive, self}: {publicChannel: any, privateChannel: any, channelActive: any, users: any, onSetChannelActive: any, self: User | null}) => {
    const [showPublicChannel, setShowPublicChannel] = useState(true);
    const [showPrivateChannel, setShowPrivateChannel] = useState(true);

    return (
        <div className="flex flex-col gap-24">
            {publicChannel.length > 0 && (
                <div className="flex flex-col gap-24">
                    <div className="flex items-center gap-8 font-semibold text-body-m text-nobleBlack-100 cursor-pointer" onClick={() => setShowPublicChannel(!showPublicChannel)}>
                        <Icon icon={ChevronDown} className={`${!showPublicChannel ? '-rotate-90' : ''} transition-all`}/>
                        <span>Public Channel</span>
                    </div>
                    {showPublicChannel && (
                        <ul className="flex flex-col gap-8">
                            {publicChannel.map((channel: any) => (
                            <li key={channel.id} className={`flex flex-col rounded-12 cursor-pointer hover:bg-nobleBlack-800 hover:text-white text-nobleBlack-300 border-1 transition-all ${channelActive?.id === channel.id ? ' border-nobleBlack-600 hover:border-nobleBlack-800 text-white' : 'border-nobleBlack-700'}`} onClick={() => onSetChannelActive(channel)}> 
                                <div className="flex items-center gap-16 flex-1 p-12">
                                    <Icon icon={Globe}/>
                                    <span className="text-body-l font-semibold flex-1">{channel.name}</span>
                                    <Badge
                                        variant="Stem-Green"
                                        className={`h-32 w-32 p-0 flex justify-center items-center size-text-body-s ${channelActive?.id === channel.id ? '' : 'invisible'}`}    
                                    >
                                        {channel.connects.length}
                                    </Badge>
                                </div>
                                {channelActive?.id === channel.id && (
                                    <ul className="flex flex-col items-start gap-8 px-12 pb-16">
                                        {channel.connects.map((connect: any, index: number) => (
                                            <li className="flex items-center gap-16 h-40" key={index}>
                                                <div className="line flex-grow h-full w-24 relative">
                                                    <div className={`w-1.5 rounded-full bg-nobleBlack-600 absolute left-1/2 -translate-x-1/2 ${index === 0 ? 'h-1/2 top-1/2 -translate-y-full' : 'h-[calc(100%+8px)] -top-4 -translate-y-1/2'}`}></div>
                                                        <div className={`absolute rounded-full h-1.5 w-12 bottom-0 left-0 bg-nobleBlack-600 translate-x-full top-1/2 -translate-y-1/2`}></div>
                                                    </div>
                                                {(() => {
                                                    const user = users.find((user: any) => user.id === connect.user_id);
                                                    return (<>
                                                    <AvatarHasStatus className="w-40 h-40 rounded-12" classNameAvatar="!rounded-12" src="/assets/avatars/Adam Green.png" status={self?.id === user?.id ? stateUser(true, user?.status) : stateUser(user?.is_joined, user?.status)}/>
                                                    <span className="text-body-m font-semibold text-nobleBlack-300">{user?.name}</span>
                                                    </>);
                                                })()}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
            )}
            {privateChannel.length > 0 && (
                <>
                    <Divider classLine="bg-nobleBlack-600"/>
                    <div className="flex flex-col gap-24">
                        <div className="flex items-center gap-8 font-semibold text-body-m text-nobleBlack-100 cursor-pointer" onClick={() => setShowPrivateChannel(!showPrivateChannel)}>
                            <Icon icon={ChevronDown} className={`${!showPrivateChannel ? '-rotate-90' : ''} transition-all`}/>
                            <span>Private Channel</span>
                        </div>
                        {showPrivateChannel && (
                            <ul className="flex flex-col gap-8">
                            {privateChannel.map((channel: any) => (
                                <li key={channel.id} className={`flex flex-col gap-16 rounded-12 cursor-pointer hover:bg-nobleBlack-800 hover:text-white text-nobleBlack-300 border-1 transition-all ${channelActive?.id === channel.id ? ' border-nobleBlack-600 hover:border-nobleBlack-800 text-white' : 'border-nobleBlack-700'}`} onClick={() => onSetChannelActive(channel)}>
                                    <div className="flex items-center gap-16 flex-1 p-12">
                                        <Icon icon={PadLock}/>
                                        <span className="text-body-l font-semibold flex-1">{channel.name}</span>
                                        <Badge
                                            variant="Heisenberg-Blue"
                                            className={`h-32 w-32 p-0 flex justify-center items-center size-text-body-s ${channelActive?.id === channel.id ? '' : 'invisible'}`}
                                        >
                                            {channel.connects.length}
                                        </Badge>
                                    </div>
                                    {channelActive?.id === channel.id && (
                                        <ul className="flex flex-col items-start gap-8 px-12 pb-16">
                                            {channel.connects.map((connect: any, index: number) => (
                                                <li className="flex items-center gap-16 h-40" key={index}>
                                                    <div className="line flex-grow h-full w-24 relative">
                                                        <div className={`w-1.5 rounded-full bg-nobleBlack-600 absolute left-1/2 -translate-x-1/2 ${index === 0 ? 'h-1/2 top-1/2 -translate-y-full' : 'h-[calc(100%+8px)] -top-4 -translate-y-1/2'}`}></div>
                                                        <div className={`absolute rounded-full h-1.5 w-12 bottom-0 left-0 bg-nobleBlack-600 translate-x-full top-1/2 -translate-y-1/2`}></div>
                                                    </div>
                                                    {(() => {
                                                        const user = users.find((user: any) => user.id === connect.user_id);
                                                        return (
                                                            <div className="flex items-center gap-16">
                                                                <AvatarHasStatus 
                                                                    className="w-40 h-40 rounded-12" 
                                                                    classNameAvatar="!rounded-12" 
                                                                    src="/assets/avatars/Adam Green.png" 
                                                                    status={self?.id === user?.id ? stateUser(true, user?.status) : stateUser(user?.is_joined, user?.status)}
                                                                />
                                                                <span className="text-body-m font-semibold text-nobleBlack-300">{user?.name}</span>
                                                            </div>
                                                        );
                                                    })()}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default DetailChatChannel;