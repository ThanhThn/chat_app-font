import React from "react";
import { OperationalStatus } from "../state";
import { cn } from "@/lib/utils";

const StatusActive: React.FC<{
  className?: string;
  status: OperationalStatus;
}> = ({ className = "", status }) => {
  const variants = {
    icons: {
      [OperationalStatus.ACTIVE]: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="14"
            height="14"
            rx="7"
            stroke="#131619"
            strokeWidth="4"
          />
          <g filter="url(#filter0_d_335_4077)">
            <circle cx="17" cy="17" r="5" fill="#4AC97E" />
          </g>
          <defs>
            <filter
              id="filter0_d_335_4077"
              x="0"
              y="0"
              width="34"
              height="34"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.290196 0 0 0 0 0.788235 0 0 0 0 0.494118 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_335_4077"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_335_4077"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      ),
      [OperationalStatus.AWAY]: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="14"
            height="14"
            rx="7"
            stroke="#131619"
            strokeWidth="4"
          />
          <g filter="url(#filter0_d_655_1678)">
            <path
              d="M21.2345 19.6601C21.4603 19.3013 21.0877 18.8998 20.6675 18.9558C20.4491 18.985 20.2263 19 20 19C17.2386 19 15 16.7614 15 14C15 13.7737 15.015 13.5509 15.0442 13.3325C15.1002 12.9123 14.6987 12.5397 14.3399 12.7655C12.9341 13.6505 12 15.2162 12 17C12 19.7614 14.2386 22 17 22C18.7838 22 20.3495 21.0658 21.2345 19.6601Z"
              fill="#E26F20"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_655_1678"
              x="0"
              y="0.697327"
              width="33.3027"
              height="33.3027"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.886275 0 0 0 0 0.435294 0 0 0 0 0.12549 0 0 0 0.48 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_655_1678"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_655_1678"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      ),
      [OperationalStatus.UNAVAILABLE]: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="14"
            height="14"
            rx="7"
            stroke="#131619"
            strokeWidth="4"
          />
          <g filter="url(#filter0_d_335_5166)">
            <circle cx="17" cy="17" r="3.5" stroke="#D0302F" strokeWidth="3" />
          </g>
          <defs>
            <filter
              id="filter0_d_335_5166"
              x="0"
              y="0"
              width="34"
              height="34"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.815686 0 0 0 0 0.188235 0 0 0 0 0.184314 0 0 0 0.48 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_335_5166"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_335_5166"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      ),
      [OperationalStatus.OFFLINE]: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <circle
            cx="9"
            cy="9"
            r="7"
            fill="#363A3D"
            stroke="#131619"
            strokeWidth="4"
          />
        </svg>
      ),
    },
  };

  return (
    <div className={cn("h-fit w-fit bg-transparent", className)}>
      {variants.icons[status]}
    </div>
  );
};

export default StatusActive;
