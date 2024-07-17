import { IManager, State } from "@/stream/manager";
import { dataChannel } from "@/stream/data-channel";

export class AnswerPeerManager implements IManager {
  connection = new RTCPeerConnection();
  private description: RTCSessionDescription | null = null;

  isLocalDescriptionSet = false;
  isRemoteDescriptionSet = false;
  isConnected = false;

  dataChannel = dataChannel;

  onChange: (state: State, data?: any) => void = () => {};

  constructor() {
    this.connection.addEventListener("track", (event) => {
      console.log(event);
    });
  }

  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.connection.addTrack(track, ...streams);
  }

  removeTracks() {
    console.log(this.connection.getSenders(), this.connection.getReceivers());
    this.connection
      .getSenders()
      .forEach((sender) => this.connection.removeTrack(sender));
  }

  async getDescription() {
    return this.description;
  }

  async createDescription() {
    try {
      this.connection.ondatachannel = (e) => {
        const channel = e.channel;
        dataChannel?.setChannel(channel);
        dataChannel?.on("open", () => {
          this.isConnected = true;
          this.onChange("CONNECTED");
        });
      };

      this.connection.onicecandidate = () => {
        this.description = this.connection.localDescription;
        this.onChange("LOCAL_DESCRIPTION_SET");
      };

      const answer = await this.connection.createAnswer();
      this.connection.setLocalDescription(answer);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    try {
      await this.connection.setRemoteDescription(description);
      this.onChange("REMOTE_DESCRIPTION_SET");
    } catch (error: unknown) {
      console.error(error);
    }
  }
}
