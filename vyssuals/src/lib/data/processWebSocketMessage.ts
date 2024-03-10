import type { WebSocketMessage } from "../types";
import { db } from "./databaseManager";

export const processMessage = (message: string) => {
    const parsedMessage: WebSocketMessage = JSON.parse(message);
    console.log(parsedMessage);
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
                db.get(message.senderName).addItems(message.payload.data);
            }
            if (message.payload.metadata) {
                db.get(message.senderName).addMetadata(message.payload.metadata);
            }
            if (message.payload.update) {
                db.get(message.senderName).addUpdate(message.payload.update);
            }
        }
    }
}

function processDisconnectMessage(message: WebSocketMessage): void {
    if (message.type === "disconnect") {
        if (message.senderName) {
            db.deleteDatabase(message.senderName);
        }
    }
}
