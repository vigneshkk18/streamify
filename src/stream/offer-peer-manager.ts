import { dataChannel } from "@/stream/data-channel";
import { IManager, State } from "@/stream/manager";

export class OfferPeerManager implements IManager {
  connection = new RTCPeerConnection();
  private description: RTCSessionDescription | null = null;

  isLocalDescriptionSet = false;
  isRemoteDescriptionSet = false;
  isConnected = false;

  dataChannel = dataChannel;

  onChange: (state: State, data?: any) => void = () => {};

  constructor() {
    this.connection.ontrack = (ev) => {
      console.log(ev);
      this.onChange("STREAMS", ev.streams);
    };
  }

  async getDescription() {
    return this.description;
  }

  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.connection.addTrack(track, ...streams);
  }

  removeTracks() {
    this.connection
      .getSenders()
      .forEach((sender) => this.connection.removeTrack(sender));
  }

  async createDescription() {
    try {
      const channel = this.connection.createDataChannel("data-channel");
      dataChannel?.setChannel(channel);
      dataChannel?.on("open", () => {
        this.isConnected = true;
        this.onChange("CONNECTED");
      });

      this.connection.onicecandidate = () => {
        this.description = this.connection.localDescription;
        this.onChange("LOCAL_DESCRIPTION_SET");
      };

      const offer = await this.connection.createOffer();
      this.connection.setLocalDescription(offer);
      this.isLocalDescriptionSet = true;
    } catch (error: unknown) {
      console.error(error);
    }
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    try {
      console.log(this.connection, this.dataChannel);
      await this.connection.setRemoteDescription(description);
      this.isRemoteDescriptionSet = true;
      this.onChange("REMOTE_DESCRIPTION_SET");
    } catch (error: unknown) {
      console.error(error);
    }
  }
}
