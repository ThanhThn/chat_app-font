import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon from "./icon";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronDownSmall,
  Cross,
  Globe,
  Link,
  PaperPlane,
  PlusCircle,
} from "./icon/symbol";
import { Avatar, Badge, Button, Divider, Input } from "./ui";
import { cn } from "@/lib/utils";
import urlBase from "@/config/api";
import Chip from "./ui/chip";
import config from "@/config/constant/constant";

const Model: React.FC<{
  isShowed: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  updateProject: any;
  userId: any;
  type: "project" | "share" | "channel"| "action";
  token: string;
  users: any;
  onClick?: any;
  project: any;
  channel: any;
  onNotify: (type: "success" | "error" | "warning", message: string) => void;
}> = ({
  isShowed,
  onClose,
  updateProject,
  userId,
  type,
  token,
  users,
  onClick,
  project,
  channel,
  onNotify,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const model: Record<"project" | "share" | "channel"| "action", JSX.Element> = {
    project: (
      <ModelCreateProject
        onNotify={onNotify}
        userId={userId}
        updateProject={updateProject}
        onClose={onClose}
        token={token}
      />
    ),
    share: (
      <ModelShareProject
        token={token}
        onClose={onClose}
        projectUsers={users}
        project={project}
      />
    ),
    channel: (
      <ModelShareChannel
        project={project}
        id={userId}
        token={token}
        onClose={onClose}
        projectUsers={users}
        channel={channel}
      />
    ),
    action: (<ModelAction onClose={onClose} onClick={onClick} onNotify={onNotify}/>)
  };

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
        {model[type]}
      </div>
    </div>
  );
};

const ModelCreateProject = ({
  userId,
  updateProject,
  onClose,
  token,
  onNotify,
}: any) => {
  const [nameProject, setNameProject] = useState("");
  const [description, setDescription] = useState("");
  const inputNameProjectRef = useRef<HTMLInputElement>(null);
  const inputDescriptionRef = useRef<HTMLInputElement>(null);

  const createProject = async () => {
    try {
      const fields = {
        name: nameProject,
        description: description,
      };

      const response = await fetch(`${urlBase}/api/project/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status && data.status >= 400) {
          throw new Error(
            data.errors[0].error_message || "Unknown error occurred"
          );
        }
        onNotify("success", "Create project success");
        setNameProject("");
        updateProject((prevProjects: any[]) => [...prevProjects, data]);
      } else {
        throw new Error("Failed to create project");
      }
    } catch (err) {
      onNotify("error", (err as Error).message);
    } finally {
      inputNameProjectRef.current?.focus();
    }
  };

  return (
    <>
      <header className="flex flex-col gap-16">
        <div className="flex items-center justify-between gap-16">
          <h3 className="text-heading-s font-semibold">Create new project</h3>
          <Button
            variant="ghost"
            className="w-40 h-40 p-0 group"
            onClick={onClose}
          >
            <Icon icon={Cross} className="group-hover:text-nobleBlack-200" />
          </Button>
        </div>
        <p className="text-body-l font-medium text-nobleBlack-300">
          Create a new project by providing the project details. After creation,
          you can invite users to collaborate.
        </p>
      </header>
      <div className="flex gap-24 flex-col">
        <div className="flex gap-24">
          <Input
            name="name"
            placeHolder="Name project"
            value={nameProject}
            onChange={(event) => setNameProject(event.target.value)}
            ref={inputNameProjectRef}
          />
          <Button
            className="text-body-l font-semibold gap-16 text-nobleBlack-900"
            onClick={createProject}
          >
            Add <Icon icon={PlusCircle} className="text-nobleBlack-900" />
          </Button>
        </div>
        <Input
          placeHolder="Description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          ref={inputDescriptionRef}
        />
      </div>
    </>
  );
};

const ModelShareProject = ({
  project,
  token,
  onClose,
  projectUsers,
}: {
  project: any;
  token: string | null;
  onClose: any;
  projectUsers: Array<any>;
}) => {
  const [otherUsers, setOtherUsers] = useState<Array<any>>([]);
  const [searchUsers, setSearchUsers] = useState<Array<any>>([]);
  const [selectUsers, setSelectUsers] = useState<Array<any>>([]);
  const [showResultSearch, setShowResultSearch] = useState(false);
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const res = await fetch(
      `${urlBase}/api/users/not_project?project_id=${project.id}`
    );
    const { data }: { data: Array<any> } = await res.json();
    const users = data.filter(
      (user: any) =>
        !projectUsers.some((projectUser) => projectUser.id === user.id)
    );
    setOtherUsers(users);
  };

  const handleInvite = useCallback(async () => {
    const res = await fetch(`${urlBase}/api/project/invite_user`, {
      method: "POST",
      body: JSON.stringify({ users: selectUsers, project_id: project.id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setName("");
      setSelectUsers([]);
      onClose();
    }
  }, [token, selectUsers]);

  const handleSelectUser = (selectUser: any) => {
    setOtherUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectUser.id)
    );
    setSelectUsers((prev) => [...prev, selectUser]);
    setName("");
  };

  const handleRemoveUserHasSelect = (selectUser: any) => {
    setSelectUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectUser.id)
    );
    setOtherUsers((prev) => [...prev, selectUser]);
  };

  useEffect(() => {
    fetchUsers();
  }, [projectUsers]);

  useEffect(() => {
    const filteredUsers = otherUsers.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    setSearchUsers(filteredUsers);
    setShowResultSearch(name.length > 0);
  }, [name, otherUsers]);

  return (
    <>
      <header className="flex flex-col gap-16">
        <div className="flex items-center justify-between gap-16">
          <h3 className="text-heading-s font-semibold">
            Manage who can view this project
          </h3>
          <Button
            variant="ghost"
            className="w-40 h-40 p-0 group"
            onClick={onClose}
          >
            <Icon icon={Cross} className="group-hover:text-nobleBlack-200" />
          </Button>
        </div>
        <p className="text-body-l font-medium text-nobleBlack-300">
          Select which users can access and view this project. Only users with
          access can view and edit the project.
        </p>
      </header>
      <div className="flex gap-24">
        <div className="flex-1 relative">
          <Input
            name="name"
            placeHolder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            icon={
              selectUsers.length > 0 && (
                <div className="flex gap-4 items-center">
                  {selectUsers.map((user, index) => (
                    <Chip
                      key={index}
                      onDelete={() => handleRemoveUserHasSelect(user)}
                    >
                      <div className="flex items-center gap-6">
                        <Avatar
                          src="assets/avatars/Adam Green.png"
                          className="w-24 h-24"
                        />
                        <span>{user.name}</span>
                      </div>
                    </Chip>
                  ))}
                </div>
              )
            }
          />
          {showResultSearch && (
            <div className="absolute w-full rounded-16 p-4 bg-nobleBlack-800 top-full translate-y-10 flex flex-col gap-4">
              <span className="text-body-s font-medium text-nobleBlack-300 p-12">
                Users
              </span>
              <div className="flex flex-col gap-4">
                {searchUsers.length > 0 ? (
                  searchUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex gap-16 items-center p-12 rounded-12 border-t-1 border-transparent hover:bg-glass-fill hover:border-white/8"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Avatar src="assets/avatars/Adam Green.png" />
                      <div className="flex flex-col gap-4">
                        <span className="text-body-l font-semibold text-white">
                          {user.name}
                        </span>
                        <span className="text-stemGreen-500 font-medium text-body-s">
                          @{user.user_name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-body-s font-medium text-white p-12 text-center">
                    No users found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <Button
          className="text-body-l font-semibold gap-12 text-nobleBlack-900"
          onClick={handleInvite}
        >
          Invite <Icon icon={PaperPlane} className="text-nobleBlack-900" />
        </Button>
      </div>
      <div className="flex gap-16 flex-col">
        {projectUsers.map((user, index) => (
          <div key={index} className="flex gap-16 items-center">
            <Avatar src="assets/avatars/Adam Green.png" />
            <div className="flex flex-col gap-4">
              <span className="text-body-l font-semibold text-white">
                {user.name}
              </span>
              <span className="text-stemGreen-500 font-medium text-body-s">
                @{user.user_name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const ModelShareChannel = ({
  id,
  channel,
  token,
  onClose,
  projectUsers,
  project,
}: {
  id: any;
  channel: any;
  token: string | null;
  onClose: any;
  projectUsers: Array<any>;
  project: any;
}) => {
  const [otherUsers, setOtherUsers] = useState<Array<any>>([]);
  const [usersInChannel, setUsersInChannel] = useState<Array<any>>([]);
  const [searchUsers, setSearchUsers] = useState<Array<any>>([]);
  const [selectUsers, setSelectUsers] = useState<Array<any>>([]);
  const [showResultSearch, setShowResultSearch] = useState(false);
  const [roleInvite, setRoleInvite] = useState(0);
  const [showBoxRole, setShowBoxRole] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<unknown>();
  const containerRef = useRef<HTMLDivElement>(null);

  const roleToVariantMap: Record<
    string,
    { text: string; variant: "Stem-Green" | "Heisenberg-Blue" | "Day-Blue" }
  > = useMemo(
    () => ({
      [config("auth.owner")]: {
        text: "Owner",
        variant: "Stem-Green",
      },
      [config("auth.editor")]: {
        text: "Editor",
        variant: "Heisenberg-Blue",
      },
      [config("auth.viewer")]: {
        text: "Viewer",
        variant: "Day-Blue",
      },
    }),
    []
  );

  const roleVariant = useMemo(() => {
    return channel?.type === "private"
      ? [
          { id: config("auth.viewer"), text: "can view" },
          { id: config("auth.editor"), text: "can edit" },
        ]
      : [{ id: config("auth.editor"), text: "can edit" }];
  }, [channel]);

  const handleInvite = useCallback(async () => {
    const res = await fetch(`${urlBase}/api/channel/add`, {
      method: "POST",
      body: JSON.stringify({
        members: selectUsers,
        project_id: project.id,
        role: roleVariant[roleInvite].id,
        channel_id: channel.id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setName("");
      setSelectUsers([]);
      onClose();
    }
  }, [token, selectUsers, roleInvite]);

  const handleSelectUser = (selectUser: any) => {
    setOtherUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectUser.id)
    );
    setSelectUsers((prev) => [...prev, selectUser]);
    setName("");
  };

  const handleRemoveUserHasSelect = (selectUser: any) => {
    setSelectUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectUser.id)
    );
    setOtherUsers((prev) => [...prev, selectUser]);
  };

  useEffect(() => {
    const filteredUsers = otherUsers.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    setSearchUsers(filteredUsers);
    setShowResultSearch(name.length > 0);
  }, [name, otherUsers]);

  useEffect(() => {
    if (!channel || !id) return;
    const connectsMap = new Map(
      channel.connects.map((connect: any) => [connect.user_id, connect.role])
    );

    const { usersChannel, otherUser } = projectUsers.reduce(
      (result, user) => {
        if (connectsMap.has(user.id)) {
          result.usersChannel.push({ ...user, role: connectsMap.get(user.id) });
        } else {
          result.otherUser.push(user);
        }
        return result;
      },
      { usersChannel: [], otherUser: [] }
    );

    setRole(connectsMap.get(id));
    setRoleInvite(0);
    setSelectUsers([]);
    setUsersInChannel(usersChannel);
    setOtherUsers(otherUser);
  }, [channel, id]);

  useEffect(() => {
    if (!showBoxRole) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowBoxRole(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBoxRole]);

  return (
    <>
      <header className="flex flex-col gap-16">
        <div className="flex items-center justify-between gap-16">
          <h3 className="text-heading-s font-semibold">
            Manage who can view this channel
          </h3>
          <Button
            variant="ghost"
            className="w-40 h-40 p-0 group"
            onClick={onClose}
          >
            <Icon icon={Cross} className="group-hover:text-nobleBlack-200" />
          </Button>
        </div>
        <p className="text-body-l font-medium text-nobleBlack-300">
          Select which users can access and view this channel. Only users with
          access can view and edit the channel.
        </p>
      </header>
      {role == config("auth.owner") && (
        <div className="flex gap-24">
          <div className="flex-1 relative">
            <Input
              name="name"
              placeHolder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              icon={
                selectUsers.length > 0 && (
                  <div className="flex gap-4 items-center">
                    {selectUsers.map((user, index) => (
                      <Chip
                        key={index}
                        onDelete={() => handleRemoveUserHasSelect(user)}
                      >
                        <div className="flex items-center gap-6">
                          <Avatar
                            src="assets/avatars/Adam Green.png"
                            className="w-24 h-24"
                          />
                          <span>{user.name}</span>
                        </div>
                      </Chip>
                    ))}
                  </div>
                )
              }
              button={
                <div
                  ref={containerRef}
                  className="text-stemGreen-500 text-body-l font-medium"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setShowBoxRole(!showBoxRole)}
                  >
                    <span>{roleVariant[roleInvite].text}</span>
                    <Icon
                      icon={ChevronDownSmall}
                      className={cn(
                        "text-stemGreen-500 transition-all",
                        showBoxRole && "rotate-180"
                      )}
                    />
                  </div>
                  {showBoxRole && (
                    <ul className="absolute top-full translate-y-12 right-2 z-10 bg-nobleBlack-600 border-nobleBlack-800 rounded-16 border-1 px-6 py-6 w-max flex flex-col gap-6">
                      {roleVariant.map((item, index) => (
                        <li
                          key={item.id}
                          className={cn(
                            "py-4 px-12 cursor-pointer hover:bg-glass-fill hover:border-white/8 border-1 border-transparent rounded-12",
                            roleInvite != index &&
                              "text-nobleBlack-300 hover:text-nobleBlack-200"
                          )}
                          onClick={() => {
                            setRoleInvite(index);
                            setShowBoxRole(false);
                          }}
                        >
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              }
            />
            {showResultSearch && (
              <div className="absolute w-full rounded-16 p-4 bg-nobleBlack-800 top-full translate-y-10 flex flex-col gap-4">
                <span className="text-body-s font-medium text-nobleBlack-300 p-12">
                  Users
                </span>
                <div className="flex flex-col gap-4">
                  {searchUsers.length > 0 ? (
                    searchUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex gap-16 items-center p-12 rounded-12 border-t-1 border-transparent hover:bg-glass-fill hover:border-white/8"
                        onClick={() => handleSelectUser(user)}
                      >
                        <Avatar src="assets/avatars/Adam Green.png" />
                        <div className="flex flex-col gap-4">
                          <span className="text-body-l font-semibold text-white">
                            {user.name}
                          </span>
                          <span className="text-stemGreen-500 font-medium text-body-s">
                            @{user.user_name}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-body-s font-medium text-white p-12 text-center">
                      No users found
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <Button
            className="text-body-l font-semibold gap-12 text-nobleBlack-900"
            onClick={handleInvite}
          >
            Invite <Icon icon={PaperPlane} className="text-nobleBlack-900" />
          </Button>
        </div>
      )}

      <div className="flex gap-16 flex-col">
        {usersInChannel.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex gap-16 items-center">
              <Avatar src="assets/avatars/Adam Green.png" />
              <div className="flex flex-col gap-4">
                <span className="text-body-l font-semibold text-white">
                  {user.name}
                </span>
                <span className="text-stemGreen-500 font-medium text-body-s">
                  @{user.user_name}
                </span>
              </div>
            </div>
            <Badge variant={roleToVariantMap[user.role].variant || "Sunglow"}>
              {roleToVariantMap[user.role].text}
            </Badge>
          </div>
        ))}
      </div>
    </>
  );
};

const ModelAction = ({ onClose, onClick, onNotify }: any) => {
  return (
    <>
      <div className="flex flex-col gap-40">
        <div className="flex items-center justify-between gap-16">
          <h3 className="text-heading-s font-semibold">Confirm Action</h3>
          <Button
            variant="ghost"
            className="w-40 h-40 p-0 group"
            onClick={onClose}
          >
            <Icon icon={Cross} className="group-hover:text-nobleBlack-200" />
          </Button>
        </div>
        <p className="text-body-l font-medium text-nobleBlack-300">
          Are you sure you want to proceed with this action?
        </p>
        <div className="flex gap-24 flex-row-reverse">
          <Button onClick={onClick}>
            <span className="text-dayBlue-900">Process</span>
            <Icon icon={CheckCircle} className="text-dayBlue-900" />
          </Button>
          <Button
            variant="tertiary"
            className="text-nobleBlack-400 transition-all"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default Model;
