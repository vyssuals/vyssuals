import { parseWebsocketData } from "./DataConnector";

export let socket: WebSocket | null = null;
let clearDataTimeout: ReturnType<typeof setTimeout> | null = null;
let timerSet = false;
let dataCleared = true;

export const connectWebSocket = () => {
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    return;
  }

  socket = new WebSocket('ws://localhost:8184');

  socket.onclose = (event: CloseEvent) => {
    // console.log("Disconnected from server");

    // Only set the timer once when the client disconnects
    if (!timerSet) {
      // Start a timer to clear the data after 10 seconds
      clearDataTimeout = setTimeout(() => {
        // Only clear the data once when the timer expires
        if (!dataCleared) {
          console.log("Clearing data");
          // ... code to clear data goes here ...
          dataCleared = true;
        }
        timerSet = false;
      }, 10000);
      timerSet = true;
    }

    // Try to reconnect to the server
    setTimeout(connectWebSocket, 5000); // wait 5 seconds before trying to reconnect
  };

  socket.onopen = (event: Event) => {
    console.log("Connected to server");
    socket?.send("Vyssuals connected");

    // If the client reconnected before the timer expired, cancel the timer
    if (clearDataTimeout !== null) {
      clearTimeout(clearDataTimeout);
      clearDataTimeout = null;
      timerSet = false;
    }

    // Reset the dataCleared flag when the client connects to the server
    dataCleared = false;
  };


  socket.onmessage = (event) => {
    console.log("Message received from server");
    handleWebSocketMessage(event.data);
  };

  socket.onerror = (error: Event) => {
    let errorEvent = error as ErrorEvent;
    // console.log(`WebSocket Error: ${errorEvent.message}`);
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
  // check if data is valid JSON
  if (data === "Vyssuals connected") {
    console.log("Connected to server");
    return;
  }
  parseWebsocketData(data);
};
