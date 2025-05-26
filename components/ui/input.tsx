import React, {
  ChangeEvent,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { State } from "../state";
import { cn } from "@/lib/utils";

interface InputProps {
  name: string;
  type?: string;
  className?: string;
  placeHolder?: string;
  value?: string;
  icon?: React.ReactNode;
  label?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  button?: React.ReactNode;
}

interface InputHandle {
  focus: () => void;
}

const Input = forwardRef<InputHandle, InputProps>(
  (
    {
      name = "",
      type = "text",
      className = "",
      placeHolder = "",
      value = "",
      icon,
      label,
      button,
      onChange,
    },
    ref
  ) => {
    const [state, setState] = useState<State>(State.DEFAULT);
    const [text, setText] = useState<string>(value || "");

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus()
    }), []);

    useEffect(() => {
      setText(value || "");
    }, [value]);

    const onHandleText = (event: ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    };

    const containerVariants = {
      styles: {
        [State.DEFAULT]: {
          input: "bg-nobleBlack-400 hover:outline-nobleBlack-500/24",
          caret: "caret-white",
        },
        [State.FOCUS]: {
          input:
            "outline-heisenbergBlue-effect/24 outline-4 outline bg-blue-green.500",
          caret: "caret-white",
        },
        [State.HOVER]: {
          input: "bg-nobleBlack-400",
          caret: "caret-nobleBlack-400",
        },
        [State.ACTIVE]: {
          input: "bg-nobleBlack-400",
          caret: "caret-nobleBlack-400",
        },
        [State.SUCCESS]: {
          input: "hover:outline-electricGreen-600/24  bg-electricGreen-600",
          caret: "caret-electricGreen-600",
        },
        [State.WARNING]: {
          input: "hover:outline-happyOrange-600/24 bg-happyOrange-600",
          caret: "caret-happyOrange-600",
        },
        [State.ERROR]: {
          input: "hover:outline-redPower-600/24 bg-redPower-600",
          caret: "caret-redPower-600",
        },
      },
    };
    return (
      <div className={cn("flex flex-col gap-16 flex-1", className)}>
        {label && (
          <label
            htmlFor="name"
            className="text-nobleBlack-300 text-body-m font-medium truncate"
          >
            {placeHolder}
          </label>
        )}
        <div
          className={cn(
            "p-1 rounded-8 min-h-48 text-body-l font-medium text-white hover:outline-4 hover:outline hover:cursor-text flex ",
            containerVariants.styles[state].input
          )}
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          <div
            className={cn(
              "flex items-center gap-12 rounded-7 px-16 flex-1 bg-nobleBlack-500 placeholder-nobleBlack-300",
              className
            )}
          >
            {icon}
            <input
              ref={inputRef}
              name={name}
              type={type}
              onFocus={() => setState(State.FOCUS)}
              onBlur={() => setState(State.DEFAULT)}
              className={cn(
                "bg-transparent outline-none flex-1 w-full",
                containerVariants.styles[state].caret
              )}
              value={text}
              placeholder={placeHolder}
              onChange={(event) => {
                onHandleText(event);
                onChange(event);
              }}
            />
            {button}
          </div>
        </div>
      </div>
    );
  }
);

export default Input;
