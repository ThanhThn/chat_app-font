import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import urlBase from "@/config/api";
import { Button } from "../ui";
import Icon from "../icon";
import { Cross, CrossMedium, CrossSmall } from "../icon/symbol";
import { DownloadMedium } from "../icon/symbol/download";

interface MediaBoxProps {
  className?: string;
  media: any;
  mediaList: any[];
  isDownload?: boolean;
  onSetMediaList: (mediaList: any) => void; // Fixed the optional property declaration
}

export const MediaBox: React.FC<MediaBoxProps> = ({
  className,
  media: initialMedia,
  mediaList,
  onSetMediaList,
  isDownload = false,
}) => {
  const [media, setMedia] = useState<any>(initialMedia);
  const [loading, setLoading] = useState<boolean>(false);
  const [falseMedia, setFalseMedia] = useState<boolean>(false)

  const handleDeleteMedia = () => {
    onSetMediaList((prev: any[]) =>
      prev.filter((item) => item.id != media?.id)
    );
  };

  const handleDownload = async () => {
    if (media?.src) {
      const link = document.createElement("a");
      const fileExtension = media.type === "image" ? ".png" : ".mp4";
      link.download = `${media.id || "download"}${fileExtension}`;

      if (media.src.startsWith("data:")) {
        link.href = media.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        try {
          const response = await fetch(media.src);
          if (!response.ok) throw new Error("Failed to fetch file from S3.");
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
        }
      }
    }
  };

  useEffect(() => {
    setMedia(initialMedia);
    return () => {
      setLoading(false);
    };
  }, [initialMedia]);

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-16 overflow-hidden group/media",
        className
      )}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full w-full bg-nobleBlack-400 animate-pulse"></div>
      ) : (
        <>
          {media?.type == "image" ? (
            <img
              className="object-cover w-full h-full"
              src={media.src || "/assets/illustrations/abstract-06.png"}
              alt="media"
              onError={(e) => { 
                e.currentTarget.src = "/assets/illustrations/abstract-06.png"; 
                setFalseMedia(true)
              }}
            />
          ) : (
            <video
              className="object-cover w-full h-full"
              src={media.src}
              controls
              onError={() => setMedia("/assets/illustrations/abstract-06.png")}
            />
          )}
        </>
      )}
      { !falseMedia ? ((isDownload ? (
        <Button
          variant="ghost"
          className="absolute top-12 p-0 right-12 w-32 h-32 hidden group-hover/media:flex transition-all duration-300  bg-nobleBlack-600/60 border-t border-white/8 rounded-12 items-center justify-center"
          onClick={() => handleDownload()}
        >
          <Icon icon={DownloadMedium} className="text-nobleBlack-200" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="absolute top-12 p-0 right-12 w-32 h-32 hidden group-hover/media:flex transition-all duration-300  bg-nobleBlack-600/60 border-t border-white/8 rounded-12"
          onClick={() => handleDeleteMedia()}
        >
          <Icon icon={CrossMedium} className="text-nobleBlack-200" />
        </Button>
      ))) : (<></>)}
    </div>
  );
};
