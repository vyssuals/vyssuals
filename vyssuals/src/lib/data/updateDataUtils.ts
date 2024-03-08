import type { WebSocketMessage, Store } from "../types";
import { Item, Updates, DataSource } from "../types";
import { dataStore } from "../store";

// Function to delete a data source from the store
export function deleteDataSource(dataSourceName: string) {
  dataStore.update((draft) => {
    delete draft.dataSources[dataSourceName];
  });
}

// Function to process a WebSocketMessage
export function processWebSocketMessage(message: WebSocketMessage) {
  dataStore.update((draft) => {
    const dataSource = getDataSource(draft, message);
    processMetadata(dataSource, message);
    processData(dataSource, message);
    processVisibleItems(dataSource, message);
  });
}

// Function to get the data source from the store, or create a new one if it doesn't exist
function getDataSource(draft: Store, message: WebSocketMessage): DataSource {
  if (!draft.dataSources[message.senderName]) {
    draft.dataSources[message.senderName] = new DataSource(
      "websocket",
      message.timestamp,
      message.senderName
    );
  }
  return draft.dataSources[message.senderName];
}

// Function to process the metadata in the message
function processMetadata(dataSource: DataSource, message: WebSocketMessage) {
  if (message.payload && message.payload.metadata) {
    message.payload.metadata.forEach((headerData) => {
      if (!dataSource.metadata[headerData.name]) {
        dataSource.metadata[headerData.name] = headerData;
      }
    });
  }
}

// Function to process the data in the message
function processData(dataSource: DataSource, message: WebSocketMessage) {
  if (message.payload && message.payload.data) {
    message.payload.data.forEach((messageItem) => {
      if (!dataSource.data[messageItem.id]) {
        dataSource.data[messageItem.id] = new Item(
          messageItem.id,
          message.timestamp,
          messageItem.attributes
        );
      }
    });
  }
}

// Function to process the visible items in the message
function processVisibleItems(
  dataSource: DataSource,
  message: WebSocketMessage
) {
  if (message.payload && message.payload.visibleItems) {
    dataSource.updates.addUpdate(
      message.timestamp,
      message.payload.visibleItems
    );
  }
}
