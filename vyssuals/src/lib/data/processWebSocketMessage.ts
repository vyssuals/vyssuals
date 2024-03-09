import type { WebSocketMessage } from "../types";
import { db } from "./db";


export const processMessage = (message: string) => {
  const parsedMessage: WebSocketMessage = JSON.parse(message);
  if (parsedMessage.type) {
    switch (parsedMessage.type) {
      case "data":
        // Make sure the payload is of type DataPayload
        processDataMessage(parsedMessage);
        break;
      case "disconnect":
        processDisconnectMessage(parsedMessage);
      break;
      default:
        console.log("Unknown message type");
    }
  }
};

// Function to process a WebSocketMessage
function processDataMessage(message: WebSocketMessage): void {
  if (message.type === "data") {
    if (!message.senderName) return;
    if (message.payload) {
      if (message.payload.data) {
        db.addItems(message.senderName, message.payload.data);
      }
      if (message.payload.metadata) {
        db.addMetadata(message.senderName, message.payload.metadata);
      }
      if (message.payload.visibleItems) {
        db.addUpdate(message.senderName, message.payload.visibleItems);
      }
    }
  }
}

function processDisconnectMessage(message: WebSocketMessage): void {
  if (message.type === "disconnect") {
    if (message.senderName) {
      db.deleteDataSource(message.senderName);
    }
  }
}

