import { useCallback, useEffect, useState } from "react";
import {
  IAgoraRTCRemoteUser,
  LocalUser,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { client } from "@/lib/agora";
import Icon from "./icon";
import {
  Camera,
  CameraOff,
  Microphone,
  MicrophoneOff,
  Phone,
} from "./icon/active";
import { Button } from "./ui";
import urlBase from "@/config/api";
import { getData } from "@/lib/firebase";

const Call: React.FC<{
  channel: string;
  router: any;
  user: any;
  token: string;
}> = ({ channel: initialChannel, router, user, token }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);
  const { localCameraTrack } = useLocalCameraTrack(isCameraActive);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicrophoneActive);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [tokenRTC, setTokenRTC] = useState("");
  const [users, setUsers] = useState<any[]>([])

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const fetchTokenRTC = useCallback(async () => {
    if (!token || !initialChannel) return;

    const res = await fetch(`${urlBase}/api/agora/token_rtc`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel_id: initialChannel }),
    });
    if (res.ok) {
      const { token } = await res.json();
      setTokenRTC(token);
    }
  }, [token, initialChannel]);

  useEffect(() => {
    fetchTokenRTC();
  }, [token, initialChannel]);

  useEffect(() => {
    const joinChannel = async () => {
      try {
        await client.join(
          process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
          initialChannel,
          tokenRTC,
          user.id
        );
        client.on("user-joined", async (user) => {
          const data = await getData(initialChannel)
          setUsers(data)
        })

        client.on("user-left", (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        client.on("user-published", async (user, mediaType) => {
          try {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
              user.videoTrack?.play(`remote-${user.uid}`);
            }
            if (mediaType === "audio") {
              user.audioTrack?.play();
            }

            setRemoteUsers((prev) => {
              if (prev.some((existingUser) => existingUser.uid === user.uid)) {
                return prev.map((existingUser) =>
                  existingUser.uid === user.uid
                    ? { ...existingUser, ...user }
                    : existingUser
                );
              }
              return [...prev, user];
            });
          } catch (error) {
            console.error("Error subscribing to user:", error);
          }
        });

        client.on("user-unpublished", (user) => {
          setRemoteUsers((prev) => {
            if (prev.some((existingUser) => existingUser.uid === user.uid)) {
              return prev.map((existingUser) =>
                existingUser.uid === user.uid
                  ? { ...existingUser, ...user }
                  : existingUser
              );
            }
            return [...prev, user];
          });
        });
      } catch (err) {
      }
    };

    if (!tokenRTC) return;
    joinChannel();

    return () => {
      client.leave();
    };
  }, [tokenRTC]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokenRTC();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchTokenRTC]);

  const handleCameraToggle = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!isCameraActive);
    }
    setIsCameraActive((prev) => !prev);
  };

  const handleMicrophoneToggle = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!isMicrophoneActive);
    }
    setIsMicrophoneActive((prev) => !prev);
  };

  const handleEndCall = () => {
    client.leave();
    if (localCameraTrack) {
      localCameraTrack.stop();
      localCameraTrack.close();
    }

    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack.close();
    }

    localStorage.removeItem("user");
    localStorage.removeItem("channel");
    localStorage.removeItem("project");

    router.push("/");
  };

  return (
    <section className="flex flex-1 gap-12 h-full">
      <div className="flex-1 flex flex-col gap-12 h-full">
        {/* Video Streams */}
        <div className="flex-1 flex gap-12 flex-wrap h-full overflow-hidden max-w-[calc(100vw-24px)] w-[calc(100vw-24px)]">
          <LocalUser
            className="flex-1 h-full flex items-center justify-center rounded-12 bg-nobleBlack-800"
            // audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={isCameraActive}
            micOn={isMicrophoneActive}
            cover="assets/illustrations/abstract-04.png"
          />
          {remoteUsers.map((user: any) => {
            return (
              <div
                key={user.uid}
                id={`remote-${user.uid}`}
                className="flex-1 bg-nobleBlack-800 rounded-12 overflow-hidden relative w-full h-full"
              >
                {user.videoTrack && user.videoTrack.play ? (
                  <>{user.videoTrack.play(`remote-${user.uid}`)}</>
                ) : (
                  <div className="absolute w-full h-full overflow-hidden z-0 left-0 top-0">
                    <div
                      className="w-full h-full bg-cover bg-center bg-no-repeat blur-lg brightness-[.4]"
                      style={{
                        backgroundImage:
                          "url('assets/illustrations/abstract-04.png')",
                      }}
                    ></div>
                    <img
                      src="assets/illustrations/abstract-04.png"
                      className="absolute top-1/2 left-1/2 max-w-[50%] max-h-[50%] aspect-square transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden object-cover"
                    />
                  </div>
                )}
                <div className="absolute z-50 bottom-12 right-12 w-48 h-48 rounded-full bg-glass-fill items-center justify-center flex border-1 border-white/8">
                  <Icon
                    icon={!user._audio_muted_ ? Microphone : MicrophoneOff}
                  />
                </div>
                <div className="absolute z-50 bottom-12 left-12 py-8 px-16 text-body-m font-medium rounded-full bg-glass-fill items-center justify-center flex border-1 border-white/8 text-nobleBlack-300">
                  {users[user.uid].name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Điều khiển */}
        <div className="bg-nobleBlack-800 rounded-12 p-12 flex justify-center items-center gap-12">
          <Button
            variant="outline"
            className="flex gap-4 p-0 w-52 h-52 items-center justify-center rounded-10"
            onClick={handleMicrophoneToggle}
          >
            {isMicrophoneActive ? (
              <Icon
                icon={Microphone}
                className={`text-${
                  isMicrophoneActive ? "stemGreen-500" : "red-500"
                }`}
              />
            ) : (
              <Icon
                icon={MicrophoneOff}
                className={`text-${
                  isMicrophoneActive ? "stemGreen-500" : "red-500"
                }`}
              />
            )}
          </Button>
          <Button
            className="h-52 w-64 p-0 rounded-10"
            variant="outline"
            onClick={handleEndCall}
          >
            <Icon icon={Phone} className="text-stemGreen-500" />
          </Button>
          <Button
            variant="outline"
            className="flex gap-4 p-0 w-52 h-52 items-center justify-center rounded-10"
            onClick={handleCameraToggle}
          >
            {isCameraActive ? (
              <Icon icon={Camera} className="text-stemGreen-500" />
            ) : (
              <Icon icon={CameraOff} className="text-stemGreen-500" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Call;
