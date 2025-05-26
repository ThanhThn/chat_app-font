import urlBase from "@/config/api";
import Icon from "./icon";
import {
  Globe,
  PlusCircle,
  ArrowRight,
  PaperPlane,
  PadLock,
} from "./icon/symbol";
import { useEffect, useState } from "react";
import { Input, Button } from "./ui";

function ChatChannel({
  project,
  token,
  onClick,
  publicChannel,
  privateChannel,
  fetchChannel,
}: {
  project: any;
  token: string | null;
  onClick: any;
  publicChannel: any;
  privateChannel: any;
  fetchChannel: () => Promise<void>;
}) {
  // State for toggling add channel UI
  const [addPublicChannel, setAddPublicChannel] = useState(false);
  const [addPrivateChannel, setAddPrivateChannel] = useState(false);

  // State for new channel names
  const [publicChannelName, setPublicChannelName] = useState("");
  const [privateChannelName, setPrivateChannelName] = useState("");

  const createChannel = async (type: string) => {
    try {
      // Make API call to create new channel
      const response = await fetch(`${urlBase}/api/channel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: project.id,
          type, // Using object shorthand since key and value are same
          name: type === "public" ? publicChannelName : privateChannelName,
        }),
      });

      // Refresh channel list after creating new one
      await fetchChannel();

      // Reset form state based on channel type
      if (type === "public") {
        setPublicChannelName(""); // Clear input
        setAddPublicChannel(false); // Hide form
      } else {
        setPrivateChannelName(""); // Clear input
        setAddPrivateChannel(false); // Hide form
      }
    } catch (error) {
      // Log any errors during channel creation
      console.error("Error creating channel:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-64 px-52">
      <div className="project-name flex items-center flex-col gap-16">
        <h4 className="text-heading-m font-bold">{project?.name_project}</h4>
        <p className="text-body-L text-nobleBlack-300 font-medium">
          {project?.description_project}
        </p>
      </div>
      <div className="channel flex gap-64 w-full">
        <div className="public flex-1 flex flex-col gap-32">
          <div className="public-title flex items-center flex-col gap-16">
            <div className="flex items-center justify-center rounded-full w-48 h-48 border-t-1 border-white/8 bg-glass-fill">
              <Icon className="text-stemGreen-500" icon={Globe} />
            </div>
            <p className="text-body-xl font-semibold">Public Channels</p>
          </div>
          <ul className="flex flex-col gap-8">
            {publicChannel.map((channel: any) => (
              <li
                key={channel.id}
                className="border-t-1 border-white/8 bg-glass-fill rounded-12 p-16 flex items-center justify-between gap-8 text-nobleBlack-200 text-body-m font-semibold cursor-pointer group"
                onClick={() => onClick(channel)}
              >
                {channel.name}
                <Icon
                  icon={ArrowRight}
                  className="group-hover:text-nobleBlack-200"
                />
              </li>
            ))}
            {addPublicChannel && (
              <li>
                <Input
                  className="text-body-m font-semibold"
                  placeHolder="Public Channel"
                  name="public_channel"
                  onChange={(e) => {
                    setPublicChannelName(e.target.value);
                  }}
                  button={
                    <Button
                      className="p-0 group"
                      variant="ghost"
                      onClick={() => createChannel("public")}
                    >
                      <Icon
                        icon={PaperPlane}
                        className="group-hover:text-nobleBlack-200"
                      />
                    </Button>
                  }
                />
              </li>
            )}
            <li
              className="border-t-1 border-white/8 bg-glass-fill rounded-12 p-16 flex items-center justify-between gap-8 text-nobleBlack-200 text-body-m font-semibold cursor-pointer group"
              onClick={() => setAddPublicChannel(!addPublicChannel)}
            >
              <p>Add public channel</p>
              <Icon
                icon={PlusCircle}
                className="group-hover:text-stemGreen-500"
              />
            </li>
          </ul>
        </div>
        <div className="private flex-1 flex flex-col gap-32 ">
          <div className="private-title flex items-center flex-col gap-16">
            <div className="flex items-center justify-center rounded-full w-48 h-48 border-t-1 border-white/8 bg-glass-fill">
              <Icon className="text-heisenbergBlue-400" icon={PadLock} />
            </div>
            <p className="text-body-xl font-semibold">Private Channels</p>
          </div>
          <ul className="flex flex-col gap-8">
            {privateChannel.map((channel: any) => (
              <li
                key={channel.id}
                className="border-t-1 border-white/8 bg-glass-fill rounded-12 p-16 flex items-center justify-between gap-8 text-nobleBlack-200 text-body-m font-semibold cursor-pointer group"
                onClick={() => onClick(channel)}
              >
                {channel.name}
                <Icon
                  icon={ArrowRight}
                  className="group-hover:text-nobleBlack-200"
                />
              </li>
            ))}
            {addPrivateChannel && (
              <li>
                <Input
                  className="text-body-m font-semibold"
                  placeHolder="Private Channel"
                  name="private_channel"
                  onChange={(e) => {
                    setPrivateChannelName(e.target.value);
                  }}
                  button={
                    <Button
                      className="p-0 group"
                      variant="ghost"
                      onClick={() => createChannel("private")}
                    >
                      <Icon
                        icon={PaperPlane}
                        className="group-hover:text-nobleBlack-200"
                      />
                    </Button>
                  }
                />
              </li>
            )}
            <li
              className="border-t-1 border-white/8 bg-glass-fill rounded-12 p-16 flex items-center justify-between gap-8 text-nobleBlack-200 text-body-m font-semibold cursor-pointer group"
              onClick={() => setAddPrivateChannel(!addPrivateChannel)}
            >
              <p>Add private channel</p>
              <Icon
                icon={PlusCircle}
                className="group-hover:text-heisenbergBlue-400"
              />
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default ChatChannel;
