import urlBase from "@/config/api";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo | null = null;

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    encrypted: true,
    authEndpoint: `${urlBase}/broadcasting/auth`,
    auth: {
      headers: {
        'Authorization': `Bearer `
      }
    }
  });
}

export default echo;