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
            const database = db.get(message.senderName);
            database.setType("websocket");
            if (message.payload.data) {
                database.addItems(message.payload.data);
            }
            if (message.payload.metadata) {
                database.addMetadata(message.payload.metadata);
            }
            if (message.payload.update) {
                database.addUpdate(message.payload.update);
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
