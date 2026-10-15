import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
<<<<<<< HEAD
  autoConnect: true,
 
auth: (callback) => {
  const token = localStorage.getItem("token");

  console.log("JWT token exists:", Boolean(token));

  callback({ token });
},


});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("presence:sync", (userIds) => {
  console.log("Online users received:", userIds);
});

socket.on("user:online", (data) => {
  console.log("User came online:", data);
=======
  autoConnect: false,

  auth: (callback) => {
    callback({
      token: localStorage.getItem("token"),
    });
  },
>>>>>>> 93db1f3a42eb2ba05c95b191dc03211146c40f37
});

export default socket;