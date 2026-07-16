class TempChatWS {
  constructor() {
    this.ws = null;
    this.listeners = {};
  }

  //called when user clicks "Join" on the joinRoomForm
  connect(roomId, userName) {
    //if already connected , don't create second connection
    if (this.ws) return;

    this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/temp-room`);

    //as soon as connection opens ,immedialtely send the join message
    this.ws.onopen = () => {
      this.send({ type: "join", roomId, userName });
    };

    //every message from the server comes here
    //we parse it and fire the matching listener
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.listeners[data.type]) {
        this.listeners[data.type](data);
      }
    };

    this.ws.onerror = () => {
      console.error("Websocket error");
    };

    this.ws.onclose = () => {
      this.ws = null;
    };
  }

  //send any message to the server
  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  //components use this to listen for specific message types
  on(type, callback) {
    this.listeners[type] = callback;
  }

  //call when room expires or user leaves
  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.listeners = {};
  }
}

export const tempChatWS = new TempChatWS();

class PersistentChatWS {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.roomId = null;
  }

  //register a callback for a given message type
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  //remove a specific callback
  off(type, callback) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((cb) => cb !== callback);
  }

  //internal - fire all callbacks registered for a message type
  _emit(type, payload) {
    (this.listeners[type] || []).forEach((cb) => cb(payload));
  }

  connect(roomId) {
    this.roomId = roomId;

    const url = `${import.meta.env.VITE_WS_URL}/persistent-rooms/${roomId}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this._emit("connected", null);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this._emit(data.type, data);
      } catch (error) {
        console.error("PersistentChatWS: failed to parse message", error);
      }
    };

    this.ws.onclose = () => {
      this._emit("disconnected", null);
    };

    this.ws.onerror = (err) => {
      this._emit("error", err);
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.roomId = null;
  }
}

export const persistentChatWS = new PersistentChatWS();
