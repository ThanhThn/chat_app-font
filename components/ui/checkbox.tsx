import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Checkbox: React.FC<{
  label?: ReactNode;
  className?: string;
  classCheckBox?: string;
  name: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, className = "", classCheckBox = "", name, checked = true, onChange }) => {
  return (
    <div className={cn('flex gap-16', className)}>
      <div className={cn('relative h-24 w-24' ,classCheckBox)}>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className={cn('peer rounded-4 h-full w-full appearance-none bg-nobleBlack-500 border-1 border-nobleBlack-400 cursor-pointer hover:border-2 checked:border-none checked:bg-dayBlue-blue-green.500' ,classCheckBox)}
        />
        <span className="opacity-0 h-full w-full flex items-center justify-center peer-checked:opacity-100 absolute top-0 left-0 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1.5 3.4L4.14546 6.22183C4.54054 6.64324 5.20946 6.64324 5.60454 6.22183L10.5 1"
              stroke="#0C1132"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default Checkbox;
