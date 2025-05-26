import { getLinkInText } from "@/lib/utils";
import { LinkBox } from "./link_box";
import { useEffect, useState } from "react";
import { MediaBox } from "./media_box";

const ContextMessage = ({ message }: { message: any }) => {
  const [links, setLinks] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  // Move links extraction to useEffect to avoid state updates during render
  useEffect(() => {
    setLinks(message.links);
    setMediaList(message.media);
    setUrls(message.links.map((item: any) => item.url));
  }, [message]);

  //   if (!links || links.length === 0) {
  //     return <div className="flex flex-col gap-8">{message.text}</div>;
  //   }
  let parts = [];
  if (message.text) {
    parts = message.text?.split(new RegExp(`(${urls.join("|")})`, "g"));
  }

  return (
    <div className="flex flex-col gap-8 @container">
      <div>
        {parts.map((part: string, index: number) =>
          urls.includes(part) ? (
            <a
              key={index}
              href={part}
              target="_blank"
              className="text-stemGreen-500"
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </div>
      <div className="flex gap-24 flex-wrap">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            className="flex-1 media_item aspect-square max-h-56 basis-1/2 @md:basis-1/3 @xl:basis-1/4 @3xl:basis-1/5 @7xl:basis-1/6"
          >
            <LinkBox
              link={link}
              links={links}
              onSetLinks={setLinks}
              isCallMetaData={false}
            />
          </a>
        ))}
        {mediaList.map((media, index) => (
          <div
            key={index}
            className="flex-1 media_item aspect-square max-h-56 basis-1/2 @md:basis-1/3 @xl:basis-1/4 @3xl:basis-1/5 @7xl:basis-1/6"
          >
            <MediaBox
              isDownload={true}
              media={media}
              mediaList={mediaList}
              onSetMediaList={setMediaList}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextMessage;
