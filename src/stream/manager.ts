import { AnswerPeerManager } from "@/stream/answer-peer-manager";
import { OfferPeerManager } from "@/stream/offer-peer-manager";

export type State =
  | "LOCAL_DESCRIPTION_SET"
  | "REMOTE_DESCRIPTION_SET"
  | "CONNECTED"
  | "STREAMS";

export interface IManager {
  getDescription: () => Promise<RTCSessionDescription | null>;
  createDescription: () => Promise<void>;
  setRemoteDescription: (
    description: RTCSessionDescriptionInit
  ) => Promise<void>;
  onChange: (state: State) => void;
}

export class Manager {
  isReadyToBeConnected = false;
  isConnectedToPeer = false;
  isReady = false;

  manager: IManager | undefined;

  onChange: (state: State) => void = () => {};

  registerEvents() {
    if (!this.manager) return;
    this.manager.onChange = (state) => {
      if (state === "CONNECTED") this.isReady = true;
      if (state === "LOCAL_DESCRIPTION_SET") this.isReadyToBeConnected = true;
      if (state === "REMOTE_DESCRIPTION_SET") this.isConnectedToPeer = true;
      this.onChange(state);
    };
  }

  initializeAsCreatee() {
    this.manager = new OfferPeerManager();
  }

  initializeAsJoinee() {
    this.manager = new AnswerPeerManager();
  }

  leaveRoom() {
    this.manager = undefined;
  }
}
