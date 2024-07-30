# Streamify

**Streamify** is a decentralized streaming platform. By creating virtual rooms, users can securely stream files directly without relying on cloud storage or intermediaries. Leveraging WebRTC technology, Streamify offers a fast, efficient, and private streaming experience.

### Tech Stack
* Frontend Framework: React
* Styling: Shadcn
* Peer-to-Peer Connection: WebRTC API
* Signaling Server: Websocket (Node.js)

### Project Goals
* Decentralized streaming
* Real-time streaming between devices

### Installation
**Prerequisites:**
1. Clone the Signaling Server repository and follow the instructions to setup the signaling server:

    ```bash
    git clone https://github.com/vigneshkk18/webrtc-signaling-server.git
    ```
2. Add the signaling server url as env variable

    ```.env
    VITE_SOCKET_URL = "[YOU_URL]/one-to-one"
    ```
3. Install dependencies
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm run dev
    ```

### Demo

https://github.com/user-attachments/assets/038c910a-97b8-4eb5-a12a-b7493e79d0f7
