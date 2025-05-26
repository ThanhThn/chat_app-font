import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import urlBase from "@/config/api";
import cheerio from "cheerio";
// import getMetaData from "metadata-scraper";
interface LinkBoxProps {
  className?: string;
  link: any;
  links: any[];
  onSetLinks: (links: any) => void;
  isCallMetaData?: boolean; // Fixed the optional property declaration
}

export const LinkBox: React.FC<LinkBoxProps> = ({
  className,
  link,
  links,
  onSetLinks,
  isCallMetaData = true,
}) => {
  // Fixed the default value assignment
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          `${urlBase}/api/metadata?url=${link.url}`,
          {
            signal: controller.signal,
          }
        );

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error("Response not OK");
        }

        const { status, metadata } = await response.json();

        if (status !== 200) {
          throw new Error("Invalid status");
        }

        setImage(metadata.image);
        setTitle(metadata.title);
        setDescription(metadata.description);
        onSetLinks((prev: any[]) => {
          const exists = prev.some((item) => item.id === link.id);
          if (!exists) {
            return [...prev];
          }
          return prev.map((item) =>
            item.id === link.id
              ? {
                  ...item,
                  image: metadata.image,
                  title: metadata.title,
                  description: metadata.description,
                }
              : item
          );
        });
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof Error && error.name === "AbortError") return;

        // Remove invalid link
        onSetLinks(links.filter((l) => l !== link));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timeout = setTimeout(() => {
      setLoading(true);
      if (isCallMetaData) {
        fetchMetadata();
      } else {
        setImage(link.image);
        setDescription(link.description);
        setTitle(link.title);
        setLoading(false)
      }
    }, 1000);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeout);
      setLoading(false);
    };
  }, [link.url]);

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-16 overflow-hidden group/link",
        className
      )}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full w-full bg-nobleBlack-400 animate-pulse"></div>
      ) : (
        <>
          <img
            className="object-cover w-full h-full"
            src={image || "/assets/illustrations/abstract-06.png"}
            alt="link"
            onError={() => setImage("/assets/illustrations/abstract-06.png")}
          />
          {(title || description) && (
            <div className="absolute left-0 w-full p-8 -bottom-full group-hover/link:bottom-0 transition-all duration-300">
              <div className="flex flex-col bg-nobleBlack-600/60 border-t border-white/8 rounded-8 px-12 py-8 gap-8">
                {title && (
                  <h3 className="text-24 font-bold text-nobleBlack-200 truncate">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-16 text-white/80 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
