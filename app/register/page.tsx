"use client";

import {
  Checkbox,
  Input,
  TextGradient,
  Button,
  Divider,
} from "@/components/ui";
import Link from "next/link";
import { Step1Register, Step2Register } from "./step";
import { useState } from "react";

function Register() {
  const [stepCurrent, setStepCurrent] = useState(1);
  const handleRegisterProgress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setStepCurrent(stepCurrent + 1);
  };

  const step: { [key: number]: JSX.Element } = {
    1: <Step1Register onclick={handleRegisterProgress} />,
    2: <Step2Register onclick={handleRegisterProgress} />,
  };
  return (
    <>
      <title>Register</title>
      <section className="w-360 h-lg m-auto flex">
        <div className="relative w-full h-full flex items-center justify-center flex-col px-28">
          <div className="flex justify-between items-center w-full absolute p-48 top-0 left-0">
            <img src="/Logo.svg" alt="Logo" className="h-32 w-32" />
            {stepCurrent === 1 && (
              <Link href={"/login"}>
                <TextGradient
                  tag="span"
                  className="bg-blue-green.500 text-body-l font-semibold"
                >
                  Log In
                </TextGradient>
              </Link>
            )}
          </div>
          <div className="content w-full">{step[stepCurrent]}</div>
          <div className="flex justify-between items-center w-full absolute p-48 bottom-0 left-0 text-body-m font-medium text-nobleBlack-300">
            <p>Artificium.app © 2024</p>
            <Link href={"#"}>Privacy Policy</Link>
          </div>
        </div>
        <div className="h-full min-w-[540px] bg-cover  bg-[url('/assets/illustrations/abstract-03.png')] rounded-24"></div>
      </section>
    </>
  );
}

export default Register;
