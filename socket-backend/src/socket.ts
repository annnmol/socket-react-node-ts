"use strict";

import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import uniqid from "uniqid";
import { SOCKET_CONNECTION_TYPES } from "./utils/Enum";

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  //* list of connected users
  public users: any[];

  constructor(server: HTTPServer) {
    ServerSocket.instance = this;
    this.users = [];
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io?.on(SOCKET_CONNECTION_TYPES.CONNECT, this.StartListeners);

    console.info("Socket IO stated");
  }

  StartListeners = (socket: Socket) => {
    let time =
      new Date(Date.now()).getHours() +
      ":" +
      new Date(Date.now()).getMinutes() +
      ":" +
      new Date(Date.now()).getSeconds();
    console.log(`[${time}] User Connected with id : ${socket.id}`);

    socket.on(SOCKET_CONNECTION_TYPES.JOIN_ROOM, (data: any) => {
      console.log(`[${time}] join room request:`, data);
      socket.join(data?.room);

      let temp = {
        id: uniqid(),
        isUser: true,
        text: `${data?.userId} has joined the chat`,
        userId: data?.userId,
        type: "text",
        room: data?.room,
      };

      socket
      .to(data?.room)
      // .broadcast
      .emit(SOCKET_CONNECTION_TYPES.RECEIVE_MESSAGE, temp);
    });
    
    socket.on(SOCKET_CONNECTION_TYPES.AGENT_CONNECT, (data: any) => {
      console.log(`[${time}] Agent Connect  request:`, data);
      socket.join(data?.room);

      let temp = {
        id: uniqid(),
        isUser: true,
        text: `${data?.userId} has joined the chat`,
        userId: data?.userId,
        type: "text",
        room: data?.room,
      };

      socket
      .to(data?.room)
      // .broadcast
      .emit(SOCKET_CONNECTION_TYPES.RECEIVE_MESSAGE, temp);
    });

    socket.on(SOCKET_CONNECTION_TYPES.CLIENT_CONNECT, (data: any) => {
      console.log(`[${time}] client socket request:`, data);
      socket.join(data?.room);

      let temp = {
        id: uniqid(),
        isUser: true,
        text: `${data?.userId} has joined the chat`,
        userId: data?.userId,
        type: "text",
        room: data?.room,
      };

      socket
      .to(data?.room)
      // .broadcast
      .emit(SOCKET_CONNECTION_TYPES.RECEIVE_MESSAGE, temp);
    });

    socket.on(SOCKET_CONNECTION_TYPES.SEND_MESSAGE, (data) => {
      console.log(`[${time}] messgae in backend:`, data);
      if (data?.room) {
        socket
          .to(data?.room)
          // .broadcast
          .emit(SOCKET_CONNECTION_TYPES.RECEIVE_MESSAGE, data);
      }
    });

    socket.on(SOCKET_CONNECTION_TYPES.DISCONNECT, (data: any) => {
      console.log(`[${time}] disconnect:`, data, socket?.id);
  
      let temp = {
        id: uniqid(),
        isUser: true,
        text: `${data?.userId} has left the chat`,
        userId: data?.userId,
        type: "text",
        room: data?.room,
      };

      socket
        .to(data?.room)
        .emit(SOCKET_CONNECTION_TYPES.RECEIVE_MESSAGE, temp);

    
        socket.disconnect();

    });
  };
}
