import React from "react";
import { IIcon } from "../../icon";

const Attachment: React.FC<IIcon> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M7.22183 14.7279L12.7019 9.24784C13.3853 8.56443 14.4934 8.56443 15.1768 9.24784V9.24784C15.8602 9.93126 15.8602 11.0393 15.1768 11.7227L9.6967 17.2028C8.32986 18.5696 6.11379 18.5696 4.74695 17.2028V17.2028V17.2028C3.38012 15.836 3.38012 13.6199 4.74695 12.253L11.2877 5.71231C13.3379 3.66206 16.6621 3.66206 18.7123 5.71231V5.71231C20.7626 7.76256 20.7626 11.0867 18.7123 13.1369L12.1716 19.6777"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Attachment;
