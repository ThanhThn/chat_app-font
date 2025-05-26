import {
  Checkbox,
  Input,
  TextGradient,
  Button,
  Divider,
} from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import urlBase, { nameSaveToken } from "@/config/api";

const Step1Register: React.FC<{
  onclick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onclick }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`${urlBase}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (!res.ok) {
        throw new Error(`Network response was not ok`);
      }
      await res.json();
      router.push("/login");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="heading">
        <h2 className="text-heading-xl font-normal">
          Connect with your team and bring your creative ideas to life.
        </h2>
      </div>
      <div className="form mt-64">
        <form action="" className="flex gap-48 flex-col">
          <div className="fields grid grid-cols-2 grid-rows-2 gap-24 flex-col">
            <Input
              label={true}
              placeHolder="First name"
              name="firstName"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
            <Input
              label={true}
              placeHolder="Last name"
              name="lastName"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
            <Input
              className="col-span-2"
              label={true}
              placeHolder="Email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Input
              label={true}
              placeHolder="Password"
              name="password"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <Input
              label={true}
              placeHolder="Repeat password"
              name="repeatPassword"
              type="password"
              onChange={() => {}}
            />
          </div>
          <div className="text-body-l flex justify-between">
            <Checkbox
              name="rememberMe"
              label={
                <>
                  I agree with
                  <Link href={"#"}>
                    <TextGradient
                      tag="span"
                      className="bg-blue-green.500 font-semibold"
                    >
                      {" "}
                      Terms and conditions
                    </TextGradient>
                  </Link>
                </>
              }
              className="text-nobleBlack-200 font-medium"
            />
          </div>
          <Button
            type="submit"
            onClick={async (event) => {
              try {
                await handleRegister(event);

                onclick(event);
              } catch (error) {
                console.error("Error occurred during registration:", error);
              }
            }}
          >
            Create free account
          </Button>
        </form>
      </div>
    </>
  );
};

const Step2Register: React.FC<{
  onclick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onclick }) => {
  return (
    <>
      <div className="heading">
        <h2 className="text-heading-xl font-normal">
          Join or Create a Workspace
        </h2>
        <p className="mt-24 text-nobleBlack-300 text-body-xl font-medium">
          Connect with others by joining an existing workspace or create a new
          one to collaborate with your team.
        </p>
      </div>
      <div className="form mt-64">
        <div className="flex gap-48 flex-col">
          <div className="fields flex gap-24">
            <Input
              placeHolder="Your workspace URL"
              name=""
              className="flex-1"
              onChange={() => {}}
            />
            <Link href={"#"}>
              <Button>Join Workspace</Button>
            </Link>
          </div>
          <Divider text="or" />
          <Button variant="tertiary" type="submit" onClick={onclick}>
            Create new Workspace
          </Button>
        </div>
      </div>
    </>
  );
};

export { Step1Register, Step2Register };
