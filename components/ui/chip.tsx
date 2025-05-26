import Icon from "../icon";
import { CrossSmall } from "../icon/symbol";
import Button from "./button";

function Chip({ children, onDelete }: { children: React.ReactNode, onDelete: any }) {
    return <div className="p-12 flex items-center gap-6 rounded-12 bg-glass-fill border-1 border-white/8 text-body-s font-semibold text-nobleBlack-300 h-32">
        {children}
        <Button className="group p-0" variant="ghost" onClick={onDelete}>
            <Icon icon={CrossSmall} className="group-hover:text-white"></Icon>
        </Button>
    </div>;
}

export default Chip;