import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { State } from "./state";
import { cn, getLinkInText, openFilePicker } from "@/lib/utils";
import { Button } from "./ui";
import Icon from "./icon";
import { Attachment, Microphone } from "./icon/active";
import { PaperPlane } from "./icon/symbol";
import urlBase, { nameSaveToken } from "@/config/api";
import { LinkBox } from "./ui/link_box";
import { v4 as uuid } from "uuid";
import { MediaBox } from "./ui/media_box";

const Chat: React.FC<{
  name: string;
  type?: string;
  className?: string;
  placeHolder?: string;
  icon?: ReactNode;
  project_id: number;
  update_message: any;
  channel_id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  name = "",
  type = "text",
  className = "",
  placeHolder = "",
  project_id,
  update_message,
  channel_id,
  onChange,
}) => {
  const [state, setState] = useState<State>(State.DEFAULT);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onend = function () {
    setBusy(false);
    setRecording(false);
  };

  recognition.onerror = () => {
    setBusy(false);
    setText("");
    setRecordError(true);
  };

  recognition.onresult = (event: any) => {
    let current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    setText(transcript);
    ref.current?.focus();
  };

  const onHandleText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const onSendMessage = async () => {
    let token = localStorage.getItem(nameSaveToken);
    if (!token || (!text && mediaList.length <= 0)) {return;}

    try {
      const fields = { message: { text, links, media: mediaList }, project_id, channel_id };
      const response = await fetch(`${urlBase}/api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        const res = await response.json();
        update_message((prev: any[]) => [...prev, { ...res }]);
        setText("");
        setLinks([]);
        setMediaList([])
        ref.current?.focus();
      } else throw new Error("Failed to send message");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendMessage();
    }
  };

  const handleFilePick = () => {
    openFilePicker((file) => {
      if (!file) return; 
      const reader = new FileReader();
 
      reader.readAsDataURL(file);
  

      reader.onloadend = () => {
        const src = reader.result;
  
        if (file.type.startsWith('image/')) {
          setMediaList(prev => [
            ...prev,
            {
              id: uuid(),
              type: "image",
              src: src,
            }
          ]);
        } else if (file.type.startsWith('video/')) {
          setMediaList(prev => [
            ...prev,
            {
              id: uuid(),
              type: "video",
              src: src,
            }
          ]);
        }
      };
  
      reader.onerror = () => {
        console.error('Error reading the file');
      };
    });
  };
  

  const handleConvertRecordToText = () => {
    setBusy(true);
    setRecording(!recording);
    ref.current?.focus();
  };

  useEffect(() => {
    if (recording) {
      recognition.start();
    } else recognition.stop();
    return () => {
      recognition.stop();
    };
  }, [recording]);

  useEffect(() => {
    if (recordError) {
      const timer = setTimeout(() => {
        setRecordError(false);
        ref.current?.focus();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [recordError]);

  useEffect(() => {
    if (text) {
      const linksArray = getLinkInText(text);
      if (linksArray) {
        const mappedLinks = linksArray.map((element, index) => {
          const existingLink = links.find(
            (link, linkIndex) => link.url === element && linkIndex === index
          );
          if (existingLink) {
            return existingLink;
          }
          return {
            id: uuid(),
            url: element,
          };
        });

        setLinks(mappedLinks);
      }
    }
  }, [text]);

  const containerVariants = {
    styles: {
      [State.DEFAULT]: {
        outline:
          "bg-nobleBlack-800 border-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
      [State.FOCUS]: {
        outline:
          "bg-transparent hover:bg-stemGreen-500/24 border-stemGreen-500 hover:border-transparent",
        border: "border-transparent hover:border-stemGreen-500",
      },
      [State.HOVER]: {
        outline: "bg-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
      [State.ACTIVE]: {
        outline: "bg-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
      [State.SUCCESS]: {
        outline: "bg-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
      [State.WARNING]: {
        outline: "bg-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
      [State.ERROR]: {
        outline: "bg-transparent hover:bg-nobleBlack-500/24",
        border: "border-nobleBlack-800",
      },
    },
  };

  return (
    <div className="flex flex-col gap-10 @container">
      {(links.length > 0 || mediaList.length > 0) && (
        <div className="bg-nobleBlack-800 rounded-16 p-12 overflow-hidden">
          <div className="flex flex-wrap gap-24 overflow-y-auto no-scrollbar max-h-56">
            {links.length > 0 &&
              links.map((link, index) => (
                <div
                  key={index}
                  className="flex-1 aspect-square max-h-56 basis-1/3 @xl:basis-1/4 @6xl:basis-1/5 @7xl:basis-1/6"
                >
                  <LinkBox link={link} links={links} onSetLinks={setLinks} />
                </div>
              ))}

            {mediaList.length > 0 &&
              mediaList.map((media, index) => (
                <div
                  key={index}
                  className="flex-1 aspect-square max-h-56 basis-1/3 @xl:basis-1/4 @6xl:basis-1/5 @7xl:basis-1/6"
                >
                  <MediaBox mediaList={mediaList} media={media} onSetMediaList={setMediaList} />
                </div>
              ))}
          </div>
        </div>
      )}
      <div
        className={cn(
          "p-4 rounded-20 text-body-l font-medium text-white hover:cursor-text relative h-fit border-1",
          containerVariants.styles[state].outline
        )}
      >
        <div
          className={cn(
            "border-1 rounded-16 relative overflow-hidden flex items-center gap-12 px-16 bg-nobleBlack-800 placeholder-nobleBlack-300",
            containerVariants.styles[state].border,
            className
          )}
          onClick={() => {
            ref.current?.focus();
          }}
        >
          <Button
            variant="ghost"
            className="group w-48 h-48 p-0"
            onClick={handleConvertRecordToText}
          >
            <Icon
              icon={Microphone}
              className="group-hover:text-nobleBlack-200"
            />
          </Button>
          <div
            className={cn(
              "bg-transparent outline-none flex-1 w-full h-full flex items-center gap-8 relative"
            )}
          >
            {busy ? (
              <AnimationVoice
                className={cn(busy && !recording ? "!animate-none" : "")}
              />
            ) : (
              recordError && (
                <p
                  className={cn(
                    "bg-transparent outline-none flex-1 w-full animate-pulse"
                  )}
                >
                  Try again
                </p>
              )
            )}
            <>
              <input
                ref={ref}
                name={name}
                type={type}
                onFocus={() => setState(State.FOCUS)}
                onBlur={() => setState(State.DEFAULT)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "bg-transparent outline-none flex-1 w-full caret-stemGreen-500",
                  busy || recording || recordError
                    ? "opacity-0 absolute top-full"
                    : "relative"
                )}
                value={text}
                placeholder={placeHolder}
                onChange={(event) => {
                  onHandleText(event);
                  onChange(event);
                }}
              />
            </>
          </div>
          <Button variant="ghost" className="group w-48 h-48 p-0" onClick={handleFilePick}>
            <Icon
              icon={Attachment}
              className="group-hover:text-nobleBlack-200"
            />
          </Button>
          <Button
            variant="tertiary"
            className="group w-48 h-48 p-0"
            onClick={onSendMessage}
          >
            <Icon
              icon={PaperPlane}
              className="group-hover:text-nobleBlack-200"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AnimationVoice: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      {[...Array(7)].map((_, index) => {
        const jumpUpDelay = index * 0.1;
        const waveDelay = jumpUpDelay + 1;

        return (
          <span
            key={index}
            style={{
              animation: `jumpUp 0.4s linear ${jumpUpDelay}s 1, wave .6s linear ${waveDelay}s infinite`,
            }}
            className={cn(
              "inline-block bg-stemGreen-500 h-6 w-6 rounded-full animate-jumpUpToWave",
              className
            )}
          ></span>
        );
      })}
    </>
  );
};

export default Chat;
