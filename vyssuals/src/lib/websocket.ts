// websocket.ts
export let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    // WebSocket is already open, no need to reconnect
    return;
  }

  socket = new WebSocket('ws://127.0.0.1:8184');

  socket.onopen = () => {
    let time = new Date().toLocaleTimeString();
    socket?.send(`${time} CalcLive connected`);
  };

  socket.onmessage = (event) => {
    console.log('Message received from server');
    handleWebSocketMessage(event.data);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('Connection died');
    }

    // Attempt to reconnect after a delay (e.g., 5 seconds)
    setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };

socket.onerror = (error: Event) => {
    let errorEvent = error as ErrorEvent;
    console.log(`WebSocket Error: ${errorEvent.message}`);
    // Handle the error as needed
};

  // Add event listener for beforeunload event
  window.addEventListener('beforeunload', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // WebSocket is still open, send disconnection message to the server
      socket.send('CalcLive disconnected');
      socket.close();
    }
  });
};

export const handleWebSocketMessage = (data: any) => {
  // Handle the WebSocket message here
  console.log(data);
};
