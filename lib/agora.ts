import AgoraRTC from "agora-rtc-react";

AgoraRTC.setLogLevel(4);
export const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const joinChannelAgora = async (channelId : string) => {
    if (client.connectionState === "DISCONNECTED") {
      await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID || "", channelId, null, null);
    }
  };