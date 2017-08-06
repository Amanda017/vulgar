import * as io from 'socket.io-client';

let config = require('../../../../config/config.json');

const SOCKET_PORT: string = config.SOCKET_PORT || 3001;
const SOCKET_URI: string = config.SOCKET_URI || setSocketUri();

function setSocketUri() {
  let splitter: string = ':';
  // Split on port
  let split: Array<string> = window.location.href.split(splitter);
  // Put together uri for client to communicate with `socketio`
  let uri: string = split[0].concat(splitter)
                            .concat(split[1])
                            .concat(splitter)
                            .concat(SOCKET_PORT);
  return uri;
}

export class ClientSocket {
  connected: boolean = false;
  socket: any;
  uri: string = SOCKET_URI;

  constructor() { }

  public initialize() {
    this.socket = io(SOCKET_URI);
    this.socket.on('connect', () => {
      this.connected = true;
    });
  }

  public disconnect() {
    // Don't try to reconnect when connection was interrupted
    this.connected = false;
    this.socket.disconnect();
  }

  public io(event: string, func: any) {
    this.socket.on(event, func);
  }
}
