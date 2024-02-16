import { parseWebsocketData } from "./DataConnector";

export let socket: WebSocket | null = null;
let clearDataTimeout: ReturnType<typeof setTimeout> | null = null;

export const connectWebSocket = () => {
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    return;
  }

  socket = new WebSocket('ws://127.0.0.1:8184');

  socket.onclose = (event: CloseEvent) => {
    console.log("Disconnected from server");

    // Start a timer to clear the data after 5 seconds
    clearDataTimeout = setTimeout(() => {
      console.log("Clearing data");
      // ... code to clear data goes here ...
    }, 10000);

    // Try to reconnect to the server
    connectWebSocket();
  };

  socket.onopen = (event: Event) => {
    console.log("Connected to server");

    // If the client reconnected before the timer expired, cancel the timer
    if (clearDataTimeout !== null) {
      clearTimeout(clearDataTimeout);
      clearDataTimeout = null;
    }
  };

  socket.onmessage = (event) => {
    console.log("Message received from server");
    handleWebSocketMessage(event.data);
  };

  socket.onerror = (error: Event) => {
    let errorEvent = error as ErrorEvent;
    console.log(`WebSocket Error: ${errorEvent.message}`);
    // Handle the error as needed
  };

  // Add event listener for beforeunload event
  window.addEventListener("beforeunload", () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // WebSocket is still open, send disconnection message to the server
      socket.send("Vyssuals disconnected");
      socket.close();
    }
  });
};
export const handleWebSocketMessage = (data: any) => {
  // Handle the WebSocket message here
  // console.log(data);
  parseWebsocketData(data);
};
