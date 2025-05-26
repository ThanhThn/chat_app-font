import { getLinkInText } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MediaBox } from "./ui/media_box";

const LibraryMedia = ({ messages }: { messages: any[] }) => {
  const [mediaList, setMediaList] = useState<string[]>([]);

  useEffect(() => {
    const extractedMedia = messages.reduce((acc: string[], message: any) => {
      const media = message.context.media;
      return [...acc, ...media];
    }, []);
    setMediaList(extractedMedia.reverse());
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-y-scroll no-scrollbar">
      <div className="flex-1 flex flex-col gap-16">
        {mediaList.map((media: string, index: number) => (
          <div key={index} className="w-full aspect-square max-h-56">
            <MediaBox
              media={media}
              mediaList={mediaList}
              onSetMediaList={setMediaList}
              isDownload={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryMedia;
