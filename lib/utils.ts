import { OperationalStatus } from "@/components/state";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import echo from "./echo";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stateUser = (isJoined: boolean, status: number, notDisturb: boolean = false, online: boolean = true) => {
  if(status == 0 || !online) return OperationalStatus.OFFLINE;
  if(notDisturb) return OperationalStatus.UNAVAILABLE;
  if(isJoined) return OperationalStatus.ACTIVE;
  return OperationalStatus.AWAY
}

interface TimeResult {
  timeAgo: string;
  isTodayMessage: boolean;
}

export const calculateTimeAgo = (dateString: string, showRelativeDays?: boolean): TimeResult => {
  const createDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - createDate.getTime();

  // Convert to time units
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Format numbers with leading zero
  const pad = (n: number) => n < 10 ? `0${n}` : String(n);

  if (days > 0 || (showRelativeDays && hours >= 24)) {
    if (showRelativeDays) {
      return {
        timeAgo: `${days} days ago`,
        isTodayMessage: false
      };
    }

    // Format date for messages older than a day
    const date = pad(createDate.getDate());
    const month = pad(createDate.getMonth() + 1); 
    const year = createDate.getFullYear();
    const hour = pad(createDate.getHours());
    const min = pad(createDate.getMinutes());
    
    return {
      timeAgo: `${date}.${month}.${year}, ${hour}:${min}`,
      isTodayMessage: false
    };
  }

  // Format relative time for recent messages
  const timeAgo = hours > 0 ? `${hours} hour ago` :
                 minutes > 0 ? `${minutes} min ago` :
                 seconds > 0 ? `${seconds} sec ago` :
                 'just now';

  return {
    timeAgo,
    isTodayMessage: true
  };
};

export const setTokenEcho = (token: string) => {
  if (echo?.options?.auth?.headers) {
    echo.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export const getLinkInText = (text: string) => {
  // Regex to match URLs but exclude concatenated URLs
  const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
  
  // Split text into words and filter for valid URLs
  const matches = text.split(" ").filter(word => {
    // Check if word matches URL pattern
    const match = word.match(urlRegex);
    if (!match) return false;
    
    // Ensure URL doesn't contain another URL concatenated
    const url = match[0];
    const remainingText = word.replace(url, '');
    return !remainingText.match(urlRegex);
  });

  return matches.length > 0 ? matches : [];
}

export const openFilePicker = (callback: (file: File) => void) => {
  const input = document.createElement('input');
  input.type = 'file';

  input.onchange = (event) => {
    const target = event.target as HTMLInputElement; 
    const file = target.files?.[0];
    if (file) {
      callback(file);
    }
  };

  input.click();
};
