import { create } from "zustand";

import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { useManager } from "@/hooks/useManager";

export type Message = {
  self: boolean;
  message: string;
  time: string;
};

export const useChat = create(() => ({
  isOpen: false,
  messages: [] as Message[],
}));

export function openChat() {
  useChat.setState({ isOpen: true });
}

export function closeChat() {
  useChat.setState({ isOpen: false });
}

export function setChatState(isOpen: boolean) {
  useChat.setState({ isOpen });
}

let toastRef: ReturnType<typeof toast> | undefined = undefined;

const onOpen = () => {
  if (toastRef) toastRef.dismiss();
  openChat();
  toastRef = undefined;
};

useManager.subscribe(
  ({ dataChannel, uid }, { dataChannel: oldDataChannel }) => {
    if (dataChannel && dataChannel !== oldDataChannel) {
      dataChannel.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        if (data.type === "message") {
          useChat.setState({
            messages: [
              ...useChat.getState().messages,
              {
                message: data.message,
                self: uid === data.uuid,
                time: data.time,
              },
            ],
          });
          if (uid !== data.uuid && !useChat.getState().isOpen) {
            toastRef = toast({
              title: "New Message Recieved",
              description: data.message,
              action: (
                <ToastAction onClick={onOpen} altText="Open Message">
                  Open Message
                </ToastAction>
              ),
            });
          }
        }
      };
    }
  }
);
