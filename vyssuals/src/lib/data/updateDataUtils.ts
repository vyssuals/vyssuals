import type {
  Item,
  DataSource,
  WebSocketMessage,
  Store,
  MessageItem
} from "../types";
import { dataStore } from "../store";

// Function to delete a data source from the store
export function deleteDataSource(dataSourceName: string) {
  dataStore.update(draft => {
    delete draft.dataSources[dataSourceName];
  });
}

// Function to process a WebSocketMessage
export function processWebSocketMessage(message: WebSocketMessage) {
  dataStore.update(draft => {
    const dataSource = getDataSource(draft, message);
    processMetadata(dataSource, message);
    processData(dataSource, message);
  });
}

// Function to get the data source from the store, or create a new one if it doesn't exist
function getDataSource(draft: Store, message: WebSocketMessage): DataSource {
  if (!draft.dataSources[message.senderName]) {
    draft.dataSources[message.senderName] = createDataSource(message);
  }
  return draft.dataSources[message.senderName];
}

// Function to create a new data source
function createDataSource(message: WebSocketMessage): DataSource {
  return {
    data: {},
    metadata: {},
    lastUpdate: message.timestamp,
    type: 'websocket',
    name: message.senderName
  };
}

// Function to process the metadata in the message
function processMetadata(dataSource: DataSource, message: WebSocketMessage) {
  if (message.payload && message.payload.metadata) {
    message.payload.metadata.forEach(headerData => {
      if (!dataSource.metadata[headerData.name]) {
        dataSource.metadata[headerData.name] = headerData;
      }
    });
  }
}

// Function to process the data in the message
function processData(dataSource: DataSource, message: WebSocketMessage) {
  if (message.payload && message.payload.data) {
    message.payload.data.forEach(messageItem => {
      if (!dataSource.data[messageItem.id]) {
        dataSource.data[messageItem.id] = createNewItem(messageItem);
      }
      updateItemVersions(dataSource.data[messageItem.id], messageItem, message.timestamp);
    });
  }
}

// Function to create a new item
function createNewItem(messageItem: MessageItem): Item {
  return {
    id: messageItem.id,
    versions: {}
  };
}

// Function to update the versions of an item
function updateItemVersions(item: Item, messageItem: MessageItem, timestamp: string) {
  item.versions[timestamp] = {
    timestamp,
    ...messageItem.attributes
  };
}

