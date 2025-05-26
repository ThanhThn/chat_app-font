"use client";

import urlBase, { nameSaveToken } from "@/config/api";
import {
  Checkbox,
  Input,
  TextGradient,
  Button,
  Divider,
} from "@/components/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem(nameSaveToken);
    if (token) {
      fetch(`${urlBase}/api/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Network response was not ok.");
        })
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          setIsMounted(true);
        });
    } else setIsMounted(true);
  }, []);

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetch(`${urlBase}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Network response was not ok.");
      })
      .then(({ token }) => {
        localStorage.setItem(nameSaveToken, token);
        router.push("/");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  if (!isMounted) return null;
  return (
    <>
      <title>Login</title>
      <section className="w-360 h-lg m-auto flex relative">
        <img
          src="/Logo.svg"
          alt="Logo"
          className="top-48 left-48 h-32 w-32 absolute"
        />
        <div className="w-full h-full flex items-center justify-center flex-col px-28">
          <div className="content w-full">
            <div className="heading">
              <h2 className="text-heading-xl font-normal">
                Let's get{" "}
                <TextGradient
                  tag="span"
                  className="font-bold bg-dayBlue-blue-green.500"
                >
                  creative!
                </TextGradient>
              </h2>
              <p className="font-medium text-body-xl text-nobleBlack-300 mt-24">
                Log in to Artificium to start creating magic.
              </p>
            </div>
            <div className="form mt-64">
              <form action="" className="flex gap-48 flex-col">
                <div className="fields grid grid-rows-1 gap-24 ">
                  <Input
                    placeHolder="Email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 6L10 12M20 6L14 12M10 12L10.5858 12.5858C11.3668 13.3668 12.6332 13.3668 13.4142 12.5858L14 12M10 12L3.87868 18.1213M14 12L20.1213 18.1213M20.1213 18.1213C20.6642 17.5784 21 16.8284 21 16V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V16C3 16.8284 3.33579 17.5784 3.87868 18.1213M20.1213 18.1213C19.5784 18.6642 18.8284 19 18 19H6C5.17157 19 4.42157 18.6642 3.87868 18.1213"
                          stroke="#686B6E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                  />
                  <Input
                    placeHolder="Password"
                    name="password"
                    type={showPass? "text" :"password"}
                    value=""
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10M12 15C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15ZM12 15V17M7 20H17C18.1046 20 19 19.1046 19 18V12C19 10.8954 18.1046 10 17 10H7C5.89543 10 5 10.8954 5 12V18C5 19.1046 5.89543 20 7 20Z"
                          stroke="#686B6E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
                <div className="text-body-l flex justify-between">
                  <Checkbox
                    name="showPass"
                    label="Show password"
                    checked={showPass}
                    onChange={(e) => setShowPass(!showPass)}
                    className="text-nobleBlack-200 font-medium"
                  />
                  <Link href={"/register"}>
                    <TextGradient
                      tag="span"
                      className="bg-blue-green.500 font-semibold"
                    >
                      Forgot Password?
                    </TextGradient>
                  </Link>
                </div>
                <Button type="submit" onClick={handleLogin}>
                  Log in
                </Button>
                <Divider text="or continue with" />
                <div className="social flex items-center justify-between gap-24">
                  <Link href={"#"} className="flex-1">
                    <Button
                      className="w-full text-nobleBlack-400 hover:text-nobleBlack-300 active:text-nobleBlack-200"
                      variant="tertiary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_624_622)">
                          <path
                            d="M10.7041 8.18182V12.0546H16.1958C15.9546 13.3 15.2309 14.3546 14.1456 15.0637L17.4573 17.5819C19.3868 15.8365 20.5 13.2728 20.5 10.2274C20.5 9.51831 20.4351 8.83642 20.3145 8.18193L10.7041 8.18182Z"
                            fill="#4285F4"
                          />
                          <path
                            d="M4.98541 11.9034L4.23849 12.4638L1.59465 14.4819C3.27369 17.7455 6.71501 20.0001 10.7039 20.0001C13.4589 20.0001 15.7687 19.1092 17.4571 17.582L14.1454 15.0638C13.2363 15.6638 12.0767 16.0274 10.7039 16.0274C8.05081 16.0274 5.79669 14.2729 4.98958 11.9092L4.98541 11.9034Z"
                            fill="#34A853"
                          />
                          <path
                            d="M1.59467 5.51819C0.898969 6.8636 0.500122 8.38181 0.500122 9.99997C0.500122 11.6181 0.898969 13.1364 1.59467 14.4818C1.59467 14.4908 4.98992 11.8999 4.98992 11.8999C4.78584 11.2999 4.66521 10.6636 4.66521 9.99987C4.66521 9.33614 4.78584 8.69981 4.98992 8.09981L1.59467 5.51819Z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M10.7041 3.98184C12.2069 3.98184 13.5427 4.49092 14.6095 5.47275L17.5315 2.60914C15.7597 0.990976 13.4592 0 10.7041 0C6.71522 0 3.27369 2.24546 1.59465 5.51822L4.9898 8.10005C5.79681 5.73638 8.05102 3.98184 10.7041 3.98184Z"
                            fill="#EA4335"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_624_622">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      Google Account
                    </Button>
                  </Link>
                  <Link href={"#"} className="flex-1">
                    <Button
                      className="w-full text-nobleBlack-400 hover:text-nobleBlack-300 active:text-nobleBlack-200"
                      variant="tertiary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                      >
                        <path
                          d="M21.4144 8.1816C21.2752 8.2896 18.8176 9.6744 18.8176 12.7536C18.8176 16.3152 21.9448 17.5752 22.0384 17.6064C22.024 17.6832 21.5416 19.332 20.3896 21.012C19.3624 22.4904 18.2896 23.9664 16.6576 23.9664C15.0256 23.9664 14.6056 23.0184 12.7216 23.0184C10.8856 23.0184 10.2328 23.9976 8.74 23.9976C7.2472 23.9976 6.2056 22.6296 5.008 20.9496C3.6208 18.9768 2.5 15.912 2.5 13.0032C2.5 8.3376 5.5336 5.8632 8.5192 5.8632C10.1056 5.8632 11.428 6.9048 12.424 6.9048C13.372 6.9048 14.8504 5.8008 16.6552 5.8008C17.3392 5.8008 19.7968 5.8632 21.4144 8.1816ZM15.7984 3.8256C16.5448 2.94 17.0728 1.7112 17.0728 0.4824C17.0728 0.312 17.0584 0.1392 17.0272 0C15.8128 0.0456 14.368 0.8088 13.4968 1.8192C12.8128 2.5968 12.1744 3.8256 12.1744 5.0712C12.1744 5.2584 12.2056 5.4456 12.22 5.5056C12.2968 5.52 12.4216 5.5368 12.5464 5.5368C13.636 5.5368 15.0064 4.8072 15.7984 3.8256Z"
                          fill="white"
                        />
                      </svg>
                      Apple Account
                    </Button>
                  </Link>
                </div>
                <p className="flex gap-8 text-body-l font-semibold justify-center">
                  <span className="text-nobleBlack-400 ">
                    Don’t have an account?
                  </span>
                  <Link href={"/register"}>
                    <TextGradient tag="span" className="bg-blue-green.500">
                      Sign Up
                    </TextGradient>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="h-full min-w-[45rem] bg-cover  bg-[url('/assets/illustrations/abstract-01.png')] rounded-24"></div>
      </section>
    </>
  );
}

export default Login;
