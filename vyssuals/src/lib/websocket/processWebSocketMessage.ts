import posthog from "posthog-js";
import type { WebSocketMessage } from "../types";
import { db } from "../data/databaseManager";

export const processMessage = (message: string) => {
    const parsedMessage: WebSocketMessage = JSON.parse(message);
    if (parsedMessage.type) {
        switch (parsedMessage.type) {
            case "data":
                posthog.capture("webSocket_message_received: data");
                processDataMessage(parsedMessage);
                break;
            case "disconnect":
                posthog.capture("webSocket_message_received: disconnect");
                processDisconnectMessage(parsedMessage);
                break;
            default:
                posthog.capture("webSocket_message_received: unknown type");
        }
    }
};

// Function to process a WebSocketMessage
function processDataMessage(message: WebSocketMessage): void {
    if (message.type === "data") {
        if (!message.senderName) return;
        if (message.payload) {
            db.get(message.senderName).push("websocket", message.payload);
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
