import { getLinkInText } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LinkBox } from "./ui/link_box";

const LibraryLink = ({messages}: {messages: any[]}) => {
    const [links, setLinks] = useState<string[]>([]);
    
    useEffect(() => {
        const extractedLinks = messages.reduce((acc: string[], message: any) => {
            const links = message.context.links || []; // Ensure links is an array
            return [...acc, ...links];
        }, []);
        setLinks(extractedLinks.reverse());
    }, [messages]);


    return (
        <div className="flex-1 flex flex-col overflow-y-scroll no-scrollbar">
            <div className="flex-1 flex flex-col gap-16">
                {links.map((link: string, index: number) => (
                    <div key={index} className="w-full aspect-square max-h-56">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            <LinkBox link={link} links={links} onSetLinks={setLinks} isCallMetaData={false}/>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LibraryLink;