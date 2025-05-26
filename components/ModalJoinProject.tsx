import React, { useEffect, useRef } from "react";
import Icon from "./icon";
import { CheckCircle, Cross } from "./icon/symbol";
import { Button } from "./ui";
import { cn } from "@/lib/utils";

const ModalJoinProject: React.FC<{
  isShowed: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  project: any;
  onAccept: () => void;
  onReject: () => void;
}> = ({ isShowed, onClose, project, onAccept, onReject }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onClose?.(event as any);
      }
    };
    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "h-full w-full absolute top-0 left-0 backdrop-blur-sm bg-nobleBlack-900/64 items-center justify-center z-50",
        !isShowed ? "hidden" : "flex"
      )}
    >
      <div
        className="p-40 rounded-16 w-[45rem] bg-nobleBlack-600/96 border-t-1 border-white/8 shadow-glass-modal flex flex-col gap-40"
        ref={ref}
      >
        <ModelAction onClose={onClose} project={project} onAccept={onAccept} onReject={onReject} />
      </div>
    </div>
  );
};

const ModelAction = ({ onClose, project, onAccept, onReject }: any) => {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex items-center justify-between gap-16">
        <h3 className="text-heading-s font-semibold">Confirm Action</h3>
        <Button variant="ghost" className="w-40 h-40 p-0 group" onClick={onClose}>
          <Icon icon={Cross} className="group-hover:text-nobleBlack-200" />
        </Button>
      </div>
      <p className="text-body-l font-medium text-nobleBlack-300">
        Do you want to join the project {project?.name_project}?
      </p>
      <div className="flex gap-24 flex-row-reverse">
        <Button onClick={onAccept}>
          <span className="text-dayBlue-900">Accept</span>
          <Icon icon={CheckCircle} className="text-dayBlue-900" />
        </Button>
        <Button variant="tertiary" className="text-nobleBlack-400 transition-all" onClick={onReject}>
            Decline
        </Button>
      </div>
    </div>
  );
};

export default ModalJoinProject;
