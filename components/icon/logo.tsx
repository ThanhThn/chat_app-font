import { IIcon } from "../icon";

const Logo: React.FC<IIcon> = ({ className }) => {
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
        d="M15.4221 7.30751L20.7806 18.0276C21.4632 19.3932 20.4704 21 18.9441 21H15.4221M15.4221 7.30751L13.8365 4.13535C13.0798 2.62155 10.9202 2.62155 10.1635 4.13535L3.21942 18.0276C2.53681 19.3932 3.52955 21 5.05592 21H8.57789M15.4221 7.30751L12 10.7306M8.57789 21H15.4221M8.57789 21L5.15577 17.5769M15.4221 21L8.57789 14.1538M12 10.7306L20.7264 19.4596M12 10.7306L8.57789 14.1538M3.27361 19.4596L5.15577 17.5769M5.15577 17.5769L8.57789 14.1538"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
