import { cn } from "@/lib/utils"

const Divider:React.FC<{
    className?: string,
    classLine?: string
    text?: string
}> = ({className, text = "", classLine}) => {
    return <div className={cn("flex text-nobleBlack-400 text-body-s font-medium items-center", text ? "gap-16": "gap-0" , className)} >
        <hr className={cn("h-1 rounded-full bg-nobleBlack-500 flex-1 border-none", classLine)}/>
        <span>{text}</span>
        <hr className={cn("h-1 rounded-full bg-nobleBlack-500 flex-1 border-none", classLine)}/>
    </div>
}

export default Divider