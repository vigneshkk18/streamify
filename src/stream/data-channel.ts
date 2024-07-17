type ListenerType = "open" | "message" | "error";

export class DataChannel {
  private channel: RTCDataChannel | undefined;
  isInitialized = false;
  isClosed = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners = new Map<ListenerType, Set<any>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(type: "open" | "message" | "error", listener: any) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)?.add(listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(type: "open" | "message" | "error", listener: any) {
    if (!this.listeners.has(type)) return;
    this.listeners.get(type)?.delete(listener);
  }

  setChannel(channel: RTCDataChannel) {
    this.channel = channel;
    this.channel.onopen = (e) => {
      this.isInitialized = true;
      const listeners = this.listeners.get("open");
      if (listeners) {
        listeners.forEach((li) => li(e));
      }
    };

    this.channel.onerror = (e) => {
      this.isClosed = true;
      const listeners = this.listeners.get("error");
      if (listeners) {
        listeners.forEach((li) => li(e));
      }
    };

    this.channel.onmessage = (e) => {
      const listeners = this.listeners.get("message");
      if (listeners) {
        listeners.forEach((li) => li(e));
      }
    };
  }

  sendMessage(message: string) {
    if (!this.channel) return;
    this.channel.send(message);
  }
}

let dataChannel: DataChannel | undefined;
if (!dataChannel) {
  dataChannel = new DataChannel();
}
export { dataChannel };
