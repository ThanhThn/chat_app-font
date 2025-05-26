"use client";

import { useEffect, useState, useRef, useCallback, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarHasStatus,
  Button,
  Divider,
  NavigationItem,
  Notification,
  Tab,
} from "@/components/ui";
import { OperationalStatus } from "@/components/state";
import Model from "@/components/modal";
import ChatContainer from "@/components/chat_container";
import Users from "@/components/users";
import Icon from "@/components/icon";
import {
  CommentCircle,
  Edit,
  Logout,
  Search,
  Setting,
  Share,
} from "@/components/icon/active";
import { CreditCard } from "@/components/icon/finance/credit-card";
import {
  Bell,
  PlusCircle,
  Save,
  Trash,
  User as UserIcon,
} from "@/components/icon/symbol";
import { Folder } from "@/components/icon/storage";
import {
  Circle,
  Hexagon,
  Octagon,
  Square,
  Triangle,
} from "@/components/icon/shapes";
import urlBase, { nameSaveToken } from "@/config/api";
import echo from "@/lib/echo";
import User from "@/components/interface/User";
import { setTokenEcho } from "@/lib/utils";
import DetailChatContainer from "@/components/detail_chat_container";
import LibraryContainer from "@/components/library_container";
import { database, getData, onChange } from "@/lib/firebase";
import { sendData } from "@/lib/firebase";
import { serverTimestamp, ref, onDisconnect } from "firebase/database";
import ModalJoinProject from "@/components/ModalJoinProject";
import { v4 as uuid } from "uuid";

export default function Home() {
  const router = useRouter();
  const settingRef = useRef<HTMLDivElement>(null);
  const [navActive, setNavActive] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [actionModel, setActionModel] = useState<any>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [modelType, setModelType] = useState<
    "project" | "share" | "channel" | "action"
  >("project");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectActive, setProjectActive] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [statusCompleted, setStatusCompleted] = useState(false);
  const [showDetailChat, setShowDetailChat] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "members">("chat");
  const [publicChannel, setPublicChannel] = useState<Array<any>>([]);
  const [privateChannel, setPrivateChannel] = useState<Array<any>>([]);
  const [channelActive, setChannelActive] = useState<any>(null);
  const [usersLoaded, setUsersLoaded] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [projectInvite, setProjectInvite] = useState<any>(null);
  const [editProject, setEditProject] = useState(false);
  const [nameProjectEdit, setNameProjectEdit] = useState("");
  const [descriptionProjectEdit, setDescriptionProjectEdit] = useState("");
  const [notifications, setNotifications] = useState<Array<any>>([]);

  const plan = useMemo(
    () => ({
      0: "Basic",
      1: "Premium",
    }),
    []
  );

  const general = useMemo(
    () => [
      { icon: Search, text: "Search" },
      { icon: CreditCard, text: "Billing" },
    ],
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`${urlBase}/api/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem(nameSaveToken);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [router, token]);

  const fetchMessage = useCallback(
    async (channel: any) => {
      if (!token || !channel) {
        return;
      }
      setMessages([]);
      const res = await fetch(`${urlBase}/api/message/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: projects[projectActive].id,
          channel_id: channel?.id,
        }),
      });

      if (res.ok) {
        const { messages } = await res.json();
        setMessages(messages);
      }
    },
    [token, projects, projectActive, channelActive]
  );

  const settingItems = useMemo(
    () => [
      { icon: UserIcon, text: "Profile", onClick: () => {} },
      { icon: Bell, text: "Notification", onClick: () => {} },
      { icon: Logout, text: "Logout", onClick: handleLogout },
    ],
    [handleLogout]
  );

  const handleShowDetailChat = useCallback(
    () => setShowDetailChat((prev) => !prev),
    []
  );

  const handleActiveTab = useCallback(
    (tab: "chat" | "members") => setActiveTab(tab),
    []
  );

  const handleChannelActive = useCallback(
    (channel: any) => {
      if (channel) {
        setShowChat(true);
        setChannelActive(channel);
        fetchMessage(channel);
      }
    },
    [fetchMessage]
  );

  const handleMountedModal = useCallback(
    (
      type: "share" | "project" | "channel" | "action",
      callback: Function | null = null
    ) => {
      setModelType(type);
      setActionModel(() => callback);
      setShowModel(true);
    },
    []
  );

  const handleNotify = useCallback(
    (type: "success" | "error" | "warning", message: string) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: uuid(),
          type,
          message,
        },
      ]);
    },
    []
  );

  const navigationItems = useMemo(
    () => [
      {
        icon: CommentCircle,
        text: "Chat",
        content: (
          <ChatContainer
            messages={messages}
            onSetMessages={setMessages}
            onLoadMessage={() => fetchMessage(channelActive)}
            users={users}
            user={user}
            project={projects[projectActive]}
            showChat={showChat}
            onShowDetailChat={handleShowDetailChat}
            onModal={handleMountedModal}
            publicChannel={publicChannel}
            privateChannel={privateChannel}
            channelActive={channelActive}
            onSetChannelActive={handleChannelActive}
            fetchChannel={() => fetchChannel()}
          />
        ),
      },
      {
        icon: Folder,
        text: "Library",
        content: (
          <LibraryContainer messages={messages} channelActive={channelActive} />
        ),
      },
    ],
    [
      users,
      user,
      projects,
      projectActive,
      statusCompleted,
      showChat,
      showDetailChat,
      activeTab,
      publicChannel,
      privateChannel,
      channelActive,
      handleShowDetailChat,
      handleActiveTab,
      handleChannelActive,
      messages,
      setMessages,
      fetchMessage,
    ]
  );

  const iconProjectItem = useMemo(
    () => [Circle, Hexagon, Octagon, Square, Triangle],
    []
  );

  const styleIconProjectItem = useMemo(
    () => [
      "text-stemGreen-500 drop-shadow-multiple-stemGreen-500/30",
      "text-redPower-600 drop-shadow-multiple-redPower-600/30",
      "text-happyOrange-600 drop-shadow-multiple-happyOrange-600/30",
      "text-heisenbergBlue-500 drop-shadow-multiple-heisenbergBlue-500/30",
    ],
    []
  );

  const fetchUsers = useCallback(async () => {
    if (!token || !projects[projectActive]) return;

    try {
      setUsersLoaded(false);
      const response = await fetch(
        `${urlBase}/api/project/users?project_id=${projects[projectActive].id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const { users } = await response.json();
      setUsers(users);
      setUsersLoaded(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token, projectActive, projects]);

  const fetchChannel = useCallback(async () => {
    if (!token || !projects[projectActive]) return;
    setPrivateChannel([]);
    setPublicChannel([]);
    const control = new AbortController();

    try {
      const response = await fetch(
        `${urlBase}/api/channel/list?project_id=${projects[projectActive].id}`,
        {
          signal: control.signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }

      const { data } = await response.json();

      const channels = data.reduce(
        (acc: { public: any[]; private: any[] }, channel: any) => {
          const type = channel.type === "public" ? "public" : "private";
          acc[type].push(channel);
          return acc;
        },
        { public: [], private: [] }
      );

      setPublicChannel(channels.public);
      setPrivateChannel(channels.private);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      control.abort(); // Ensure the abort controller is called in the finally block
    }
  }, [token, projects, projectActive]);

  const handleDirectionNav = useCallback((index: number) => {
    setNavActive(index);
  }, []);

  const handleAcceptJoinProject = useCallback(async () => {
    if (!projectInvite?.id) return;

    const res = await fetch(`${urlBase}/api/project/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ project_id: projectInvite.id }),
    });

    if (!res.ok) {
      throw new Error("Failed to accept project invitation");
    }

    const projectRes = await fetch(`${urlBase}/api/project/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (projectRes.ok) {
      const { projects } = await projectRes.json();
      setProjects(projects);
    }
    setProjectInvite(null);
    setShowJoinModal(false);
  }, [projectInvite, token]);

  const handleDeclineJoinProject = useCallback(async () => {
    if (!projectInvite?.id) return;

    const res = await fetch(`${urlBase}/api/project/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ project_id: projectInvite.id }),
    });

    if (!res.ok) {
      throw new Error("Failed to decline project invitation");
    }

    setProjectInvite(null);
    setShowJoinModal(false);
  }, [projectInvite]);

  const getUsersInfo = useCallback(async () => {
    const data = await getData(`users`);
    return data;
  }, []);

  const handleOnEditProject = useCallback(() => {
    setNameProjectEdit(projects[projectActive].name_project);
    setDescriptionProjectEdit(projects[projectActive].description_project);
    setEditProject(true);
  }, [projectActive, projects]);

  const handleSaveEditProject = useCallback(async () => {
    const res = await fetch(`${urlBase}/api/project/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nameProjectEdit,
        description: descriptionProjectEdit,
        project_id: projects[projectActive].id,
      }),
    });
    if (!res.ok) {
      handleNotify("error", "Failed to save project edits");
      return;
    }
    setProjects((prev) =>
      prev.map((item, index) =>
        index === projectActive
          ? {
              ...item,
              name_project: nameProjectEdit,
              description_project: descriptionProjectEdit,
            }
          : item
      )
    );

    setEditProject(false);
    setNameProjectEdit("");
    setDescriptionProjectEdit("");
  }, [projects, projectActive, nameProjectEdit, descriptionProjectEdit, token]);

  useEffect(() => {
    const authenticateUser = async (token: string) => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        const [userRes, projectRes] = await Promise.all([
          fetch(`${urlBase}/api/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${urlBase}/api/project/list`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!userRes.ok) {
          await handleLogout();
          router.push("/login");
          return;
        }

        const userData = await userRes.json();
        const { projects } = await projectRes.json();

        setUser(userData);
        setProjects(projects);
        setIsMounted(true);
      } catch (error) {
        console.error("Error during authentication:", error);
        router.push("/login");
      }
    };

    const savedToken = localStorage.getItem(nameSaveToken);
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setTokenEcho(savedToken);
    setToken(savedToken);
    authenticateUser(savedToken);
  }, [router]);

  useEffect(() => {
    const updateProjectState = async () => {
      if (!projects.length || !token) return;

      setStatusCompleted(false);
      try {
        await fetchUsers();
        await fetchChannel();
      } catch (error) {
        console.error("Error updating project state:", error);
      } finally {
        setStatusCompleted(true);
      }
    };

    updateProjectState();
  }, [projectActive, projects, token, fetchUsers]);

  const handleUpdateChannel = useCallback((prevChannels: any[], data: any) => {
    const channelIndex = prevChannels.findIndex((item) => item.id === data.id);
    if (channelIndex !== -1) {
      const updatedChannels = [...prevChannels];
      updatedChannels[channelIndex] = {
        ...updatedChannels[channelIndex],
        ...data,
      };
      return updatedChannels;
    }
    return [...prevChannels, data];
  }, []);

  const handleDeleteProjectProcess = useCallback(
    (projectId: string) => {
      if (!projects || projectActive === undefined) return;
      if (projects[projectActive]?.id == projectId) setProjectActive(0);

      setProjects((prev) => prev.filter((item) => item.id != projectId));
    },
    [projects, projectActive]
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      if (!token) return;
      try {
        const res = await fetch(`${urlBase}/api/project/delete/${projectId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to delete the project");
        }
        const { status, message } = await res.json();
        let typeNotify: "success" | "error" | "warning" = "success";
        if (status >= 400) typeNotify = "error";
        handleNotify(typeNotify, message);
        handleDeleteProjectProcess(projectId);
        setShowModel(false);
      } catch (error) {
        handleNotify("error", "Failed to delete the project");
      }
    },
    [token, handleDeleteProjectProcess]
  );

  useEffect(() => {
    const project = projects[projectActive];
    if (!project || !usersLoaded) return;

    sendData(`users/${user?.id}`, {
      channel_id: channelActive?.id || "",
      navigation_current: navigationItems[navActive].text,
      online: true,
      project_id: project.id,
      updated_at: serverTimestamp(),
    });

    const channel = echo?.join(`project_${project.id}`);

    const updateUserStatus = (memberId: number, isJoined: boolean) => {
      setUsers((prevUsers: any) =>
        prevUsers.map((user: any) =>
          user?.id === memberId ? { ...user, is_joined: isJoined } : user
        )
      );
    };

    channel
      ?.listen(
        ".client-state",
        ({
          user: eventUser,
          navigation_current,
        }: {
          user: any;
          navigation_current: any;
        }) => {
          setUsers((prevUsers: any) =>
            prevUsers.map((user: any) =>
              user?.id === eventUser.id ? { ...user, navigation_current } : user
            )
          );
        }
      )
      .listen(".state", () => fetchUsers())
      .listen(".accept_project", () => fetchUsers())
      .listen(".channel", ({ data, type }: { data: any; type: string }) => {
        if (type === "create") {
          fetchChannel();
        }
        if (type === "update") {
          if (data.type === "private") {
            setPrivateChannel((prevChannels) =>
              handleUpdateChannel(prevChannels, data)
            );
          } else {
            setPublicChannel((prevChannels) =>
              handleUpdateChannel(prevChannels, data)
            );
          }
          if (channelActive?.id === data.id)
            setChannelActive((prev: any) => ({ ...prev, ...data }));
        }
      });

    channel
      ?.here(async (members: any[]) => {
        const usersInfo = await getUsersInfo();
        const memberIds = new Set(members.map((m) => m.id));

        setUsers((prevUsers: any) =>
          prevUsers.map((user: any) => ({
            ...user,
            is_joined: memberIds.has(user.id),
            ...(usersInfo[user.id] || {}),
          }))
        );

        users.forEach(async (user: any) => {
          onChange(`users/${user.id}/online`, (snapshot: any) => {
            setUsers((prevUsers: any) =>
              prevUsers.map((prevUser: any) =>
                prevUser?.id === user?.id
                  ? { ...prevUser, online: snapshot.val() }
                  : prevUser
              )
            );
          });
        });
      })
      .joining(async ({ id }: { id: any }) => {
        const usersInfo = await getUsersInfo();

        setUsers((prevUsers: any) =>
          prevUsers.map((user: any) => ({
            ...user,
            is_joined: user?.id === id || user?.id === user?.id,
            ...(usersInfo[id] || {}),
          }))
        );
      })
      .leaving(({ id }: { id: any }) => updateUserStatus(id, false));

    return () => {
      sendData(`users/${user?.id}/updated_at`, serverTimestamp());
      echo?.leaveChannel(`presence-project_${project.id}`);
    };
  }, [usersLoaded, projectActive, channelActive]);

  useEffect(() => {
    const project = projects[projectActive];
    if (!project) return;

    sendData(`users/${user?.id}`, {
      channel_id: channelActive?.id || "",
      navigation_current: navigationItems[navActive].text,
      project_id: project.id,
      online: true,
      updated_at: serverTimestamp(),
    });
    echo?.join(`project_${project.id}`)?.whisper("state", {
      user,
      navigation_current: navigationItems[navActive].text,
    });
  }, [navActive]);

  useEffect(() => {
    if (!channelActive || !user) return;

    const fetchData = async () => {
      const project = projects[projectActive];
      if (!project) return;

      sendData(`users/${user?.id}/channel_id`, channelActive?.id || "");
      sendData(`users/${user?.id}/updated_at`, serverTimestamp());
    };

    fetchData();

    if (!projects[projectActive]) return;
    const channel = echo?.private(
      `project_${projects[projectActive].id}-channel_${channelActive.id}`
    );
    channel
      ?.listen(".message", ({ message }: { message: any }) => {
        setMessages((prev) => {
          const existingMessage = prev.find(item => item.id === message.id);
          if (existingMessage) {
            return prev.map((item) => (item.id === message.id ? { ...item, ...message } : item));
          } else {
            return [...prev, message];
          }
        });
      })
      .listen(".delete_message", ({ id }: { id: string }) => {
        setMessages((prev: any[]) => prev.filter((item) => item.id !== id));
      });

    return () => {
      channel?.stopListening(`.message`);
    };
  }, [channelActive, user, projects[projectActive]]);

  useEffect(() => {
    if (!user?.id) return;

    const userRef = ref(database, `users/${user.id}/online`);
    onDisconnect(userRef).set(false);

    const channel = echo?.channel(`user_${user.id}`);
    channel
      ?.listen(".invited_project", async ({ project }: any) => {
        setProjectInvite(project);
        setShowModel(false);
        setShowJoinModal(true);
      })
      .listen(".edit_project", ({ project }: any) => {
        setProjects((prev) =>
          prev.map((item) => {
            if (item.id === project.id) {
              return { ...item, ...project };
            }
            return item;
          })
        );
      })
      .listen(".delete_project", ({ id }: any) => {
        handleDeleteProjectProcess(id);
      });

    return () => {
      channel?.stopListening(".invited_project");
    };
  }, [user, handleDeleteProjectProcess]);

  useEffect(() => {
    if (!user || !projects[projectActive] || !projects) return;
    const channel = echo?.channel(
      `user_${user.id}-project_${projects[projectActive].id}`
    );
    channel?.listen(".project_event", ({ data, type }: any) => {
      if (type === "update_channel") {
        if (data.type === "private") {
          setPrivateChannel((prevChannels) =>
            handleUpdateChannel(prevChannels, data)
          );
        } else {
          setPublicChannel((prevChannels) =>
            handleUpdateChannel(prevChannels, data)
          );
        }
      }
    });

    return () => {
      channel?.stopListening(".project_event");
    };
  }, [user, projects, projectActive]);

  useEffect(() => {
    if (!showSetting) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!settingRef.current?.contains(event.target as Node)) {
        setShowSetting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSetting, projectActive, projects, user]);

  useEffect(() => {
    setEditProject(false);
    setPrivateChannel([]);
    setPublicChannel([]);
    setChannelActive(null);
    setShowChat(false);
  }, [projectActive]);

  if (!isMounted) return <title>Chat App</title>;

  return (
    <>
      <title>Chat App</title>
      <div className="min-h-full h-full w-full p-12 flex gap-12 relative">
        <aside className="navigation w-[26rem] h-full bg-nobleBlack-800 rounded-20 flex flex-col">
          <div className="workspace p-24 flex items-center justify-between">
            <div className="user flex gap-16 items-center">
              <Avatar src="/assets/avatars/Avatar.png" />
              <div className="">
                <p className="text-body-l font-semibold">Intellisys</p>
                <span className="text-body-s font-medium text-stemGreen-500">
                  {projects.length > 1
                    ? projects.length + " projects"
                    : projects.length + " project"}
                </span>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12 6.66667L8.4714 10.1953C8.21106 10.4556 7.78895 10.4556 7.5286 10.1953L4 6.66667"
                stroke="#686B6E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Divider classLine="bg-nobleBlack-700" />
          <div className="general py-24 px-8 flex flex-col gap-24">
            <h6 className="px-16 uppercase text-body-s font-semibold text-nobleBlack-400">
              general
            </h6>
            <div className="flex gap-8 flex-col">
              {general.map((_, index) => (
                <NavigationItem key={index} icon={<Icon icon={_.icon} />}>
                  {_.text}
                </NavigationItem>
              ))}
            </div>
          </div>
          <Divider classLine="bg-nobleBlack-700" />
          <div className="project py-24 px-8 flex-1 flex flex-col overflow-y-hidden gap-24">
            <h6 className="px-16 uppercase text-body-s font-semibold text-nobleBlack-400">
              projects
            </h6>
            <ul className="flex flex-col gap-8 overflow-y-scroll no-scrollbar">
              {projects.map((project, index) => (
                <li key={index} className="group">
                  <Button
                    tag="div"
                    variant={projectActive === index ? "glass" : "ghost"}
                    type="button"
                    className="flex items-center justify-between p-0 w-full h-fit shadow-none border-white/8 cursor-pointer"
                    onClick={() => {
                      setProjectActive(index);
                    }}
                  >
                    <NavigationItem
                      className="text-nobleBlack-100"
                      icon={
                        <Icon
                          icon={iconProjectItem[index % iconProjectItem.length]}
                          className={
                            styleIconProjectItem[
                              index % styleIconProjectItem.length
                            ]
                          }
                        />
                      }
                    >
                      {project.name_project}
                    </NavigationItem>
                    {project.admin_id === user?.id && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMountedModal("action", () =>
                            handleDeleteProject(project.id)
                          );
                        }}
                        variant="ghost"
                        className="p-0 h-fit mr-16 group/trash group-hover:block hidden"
                      >
                        <Icon
                          icon={Trash}
                          className="group-hover/trash:text-nobleBlack-200"
                        />
                      </Button>
                    )}
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  className="block p-0 w-full"
                  onClick={() => {
                    setModelType("project");
                    setShowModel(true);
                  }}
                >
                  <NavigationItem
                    className="text-nobleBlack-400"
                    icon={<Icon icon={PlusCircle} />}
                  >
                    Add new project
                  </NavigationItem>
                </Button>
              </li>
            </ul>
          </div>
          <div className="footer p-8">
            <div className="p-16 rounded-16 flex justify-between items-center border-t-1 border-white/8 bg-glass-fill gap-16 relative">
              <div className="user flex gap-16 items-center">
                <AvatarHasStatus
                  src="/assets/avatars/Andrew Garcia.png"
                  status={OperationalStatus.ACTIVE}
                />
                <div className="">
                  <p className="text-body-l font-semibold truncate w-full">
                    {user?.name}
                  </p>
                  <span className="text-body-s font-medium text-stemGreen-500">
                    {plan[user?.plan as keyof typeof plan] ?? "Unknown"}
                  </span>
                </div>
              </div>
              <div ref={settingRef}>
                <Button
                  variant="ghost"
                  className="p-0 group"
                  onClick={() => setShowSetting(!showSetting)}
                >
                  <Icon
                    icon={Setting}
                    className="group-hover:text-nobleBlack-300 transition-all"
                  />
                </Button>
                {showSetting && (
                  <div className="absolute bottom-full right-0 bg-nobleBlack-700 border-1 border-nobleBlack-600 rounded-12 p-8 mb-12 min-w-44">
                    {settingItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="p-0 group flex items-center gap-8 w-full hover:bg-nobleBlack-800 rounded-4 py-8 px-12"
                        onClick={item.onClick}
                      >
                        <span className="text-body-l font-semibold text-nobleBlack-400 flex-1 text-left group-hover:text-white transition-all">
                          {item.text}
                        </span>
                        <Icon
                          icon={item.icon}
                          className="group-hover:text-white transition-all"
                        />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <section className="h-full w-full flex flex-col">
          {projects && projects.length > 0 ? (
            <>
              <div className="top-bar rounded-20 bg-nobleBlack-800 mb-12">
                <div className="heading p-24 pl-12 flex justify-between items-center">
                  <div className="project-name flex flex-col gap-4">
                    {editProject ? (
                      <input
                        type="text"
                        className={`text-heading-xs font-bold bg-transparent border-1 rounded-8 px-12 ${
                          editProject ? "border-dashed" : "border-transparent"
                        }`}
                        value={nameProjectEdit}
                        onChange={(e) => setNameProjectEdit(e.target.value)}
                      />
                    ) : (
                      <h4
                        className={`text-heading-xs font-bold border-1 rounded-8 px-12 ${
                          editProject ? "border-dashed" : "border-transparent"
                        }`}
                      >
                        {projects[projectActive]?.name_project}
                      </h4>
                    )}
                    {editProject ? (
                      <input
                        type="text"
                        className={`text-body-m font-medium text-nobleBlack-300 bg-transparent border-1 rounded-8 px-12 ${
                          editProject ? "border-dashed" : "border-transparent"
                        }`}
                        value={descriptionProjectEdit}
                        onChange={(e) =>
                          setDescriptionProjectEdit(e.target.value)
                        }
                      />
                    ) : (
                      <p
                        className={`text-body-m font-medium text-nobleBlack-300 border-1 rounded-8 px-12 ${
                          editProject ? "border-dashed" : "border-transparent"
                        }`}
                      >
                        {projects[projectActive]?.description_project}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-16 items-center">
                    <Users
                      users={users}
                      self={user}
                      limit={4}
                      className="mr-8"
                      onClick={() => {
                        handleActiveTab("members");
                        handleShowDetailChat();
                      }}
                    />
                    {projects[projectActive] &&
                      projects[projectActive].admin_id == user?.id && (
                        <>
                          <Button
                            className="gap-10 text-nobleBlack-400 px-16 items-center hover:text-nobleBlack-300 transition-all group"
                            variant="ghost"
                            onClick={() => {
                              handleMountedModal("share");
                            }}
                          >
                            <Icon
                              icon={Share}
                              className="group-hover:text-nobleBlack-300 transition-all"
                            />
                            <span>Share</span>
                          </Button>
                          <Button
                            className="w-40 h-40 p-0 gap-10 text-nobleBlack-200"
                            variant="tertiary"
                            onClick={() => {
                              if (editProject) {
                                handleSaveEditProject();
                              } else {
                                handleOnEditProject();
                              }
                            }}
                          >
                            <Icon
                              icon={editProject ? Save : Edit}
                              className="text-nobleBlack-200"
                            />
                          </Button>
                        </>
                      )}
                  </div>
                </div>
                <Divider classLine="bg-nobleBlack-700" />
                <div className="navigation flex gap-24 px-24">
                  {navigationItems.map((item, index) => (
                    <Tab
                      key={index}
                      active={navActive === index}
                      className="py-24"
                      icon={item.icon}
                      text={item.text}
                      onClick={() => handleDirectionNav(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="content m-20 middle flex flex-1 gap-16 overflow-y-hidden">
                {navigationItems[navActive].content}
                <DetailChatContainer
                  channelActive={channelActive}
                  publicChannels={publicChannel}
                  privateChannels={privateChannel}
                  members={users}
                  onSetChannelActive={handleChannelActive}
                  showDetailChat={showDetailChat}
                  activeTab={activeTab}
                  onActiveTab={handleActiveTab}
                  self={user}
                  currentNav={navigationItems[navActive].text}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <span className="font-semibold text-body-l">
                You are currently not participating in any project.
              </span>
            </div>
          )}
        </section>

        <Model
          onNotify={handleNotify}
          type={modelType}
          isShowed={showModel}
          users={users}
          onClose={() => setShowModel(false)}
          userId={user?.id}
          updateProject={setProjects}
          token={token || ""}
          project={projects[projectActive]}
          channel={channelActive}
          onClick={actionModel}
        />

        <ModalJoinProject
          project={projectInvite}
          onAccept={handleAcceptJoinProject}
          onReject={handleDeclineJoinProject}
          onClose={() => setShowJoinModal(false)}
          isShowed={showJoinModal}
        />
        {notifications.length > 0 && (
          <div className="absolute right-12 bottom-12 flex-col flex gap-6 items-end overflow-hidden z-50">
            {notifications.map((item) => (
              <Notification
                key={item.id}
                id={item.id}
                type={item.type}
                message={item.message}
                onNotifications={setNotifications}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
