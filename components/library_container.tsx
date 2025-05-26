import { cn } from "@/lib/utils";
import { Button, Divider } from "./ui";
import Icon from "./icon";
import { Dots } from "./icon/symbol";
import { Fragment } from "react";
import LibraryLink from "./library_link";
import LibraryMedia from "./library_media";

const LibraryContainer = ({channelActive, messages}: {channelActive: any, messages: any[]}) => {
    const components = [
        {
            title: "Media",
            content: <LibraryMedia messages={messages} />
        },
        {
            title: "Documents",
            content: <></>
        },
        {
            title: "Links",
            content: <LibraryLink messages={messages} />
        },
    ]
  return <div className={cn(`flex gap-32 flex-1 overflow-y-hidden h-full`, channelActive ? "" : "items-center justify-center")}>
    {!channelActive ? 
    <h2 className="text-heading-xs font-bold text-white">Select a channel to view the library</h2>
    :
    <div className="flex flex-1 gap-16">
        {components.map((component, index) => (
            <Fragment key={index}>
                {index > 0 && <div className="flex flex-col gap-16 h-full"><Divider className="w-1 h-full bg-nobleBlack-600" /></div>}
                <div key={index} className="flex flex-1 flex-col gap-16">
                    <div className="flex justify-between items-center py-8 px-16">
                        <h2 className="text-heading-xs font-bold text-white">{component.title}</h2>
                        <div className="flex items-center gap-8">
                            <Button variant="ghost" className="p-0"><Icon icon={Dots} /></Button>
                        </div>
                    </div>
                    {component.content}
                </div>
            </Fragment>
        ))}
    </div>
    }
  </div>
}

export default LibraryContainer;