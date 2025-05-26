import React, { useRef, useState } from "react";
import { State } from "../state";
import { cn } from "@/lib/utils";

const InputHasButton: React.FC<{
  name: string;
  type?: string;
  className?: string;
  placeHolder?: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  name = "",
  type = "text",
  className = "",
  placeHolder = "",
  value = "",
  onChange,
}) => {
  const [state, setState] = useState<State>(State.DEFAULT);
  const ref = useRef<HTMLInputElement>(null);

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
        <div
          className={cn(
            "bg-transparent outline-none flex-1 w-full h-full flex items-center gap-8 relative"
          )}
        >
          <input
            ref={ref}
            name={name}
            type={type}
            onFocus={() => setState(State.FOCUS)}
            onBlur={() => setState(State.DEFAULT)}
            onKeyDown={() => {}}
            className={cn(
              "bg-transparent outline-none flex-1 w-full caret-stemGreen-500"
            )}
            value={value}
            placeholder={placeHolder}
            onChange={(event) => {
              onChange(event);
            }}
          />
        </div>
      </div>
    </div>
  );
};


export default InputHasButton;
