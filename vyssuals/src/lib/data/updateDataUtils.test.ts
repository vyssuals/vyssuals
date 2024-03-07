import { expect } from 'chai';
import { processWebSocketMessage, deleteDataSource } from './updateDataUtils';
import { dataStore } from '../store';
import type { WebSocketMessage, Store } from '../types';

describe('updateDataUtils', () => {
    let state: Store;
  
    beforeEach(() => {
      // Reset the store before each test
      dataStore.set({ dataSources: {} });
  
      // Subscribe to the store to update the state variable whenever the store changes
      dataStore.subscribe(value => {
        state = value;
      });
    });

    const webSocketMessage: WebSocketMessage = {
        type: 'data',
        version: '1.0',
        sender: 'Revit',
        senderName: 'file-name1',
        senderVersion: '2024',
        timestamp: '1633111200000',
        payload: {
            data: [
                {
                    id: 'item1',
                    attributes: {
                        attribute1: 'value1',
                        attribute2: 'value2'
                    }
                },
                {
                    id: 'item2',
                    attributes: {
                        attribute1: 'value3',
                        attribute2: 'value4'
                    }
                }
            ],
            metadata: [
                {
                    name: 'attribute1',
                    type: 'string',
                    unitSymbol: '# Items',
                },
                {
                    name: 'attribute2',
                    type: 'string',
                    unitSymbol: '# Unique Items',
                }
            ]
        }
    }

  it('processWebSocketMessage', () => {
    processWebSocketMessage(webSocketMessage);

    expect(state.dataSources).to.have.property('file-name1');
    expect(state.dataSources['file-name1'].data).to.have.property('item1');
    expect(state.dataSources['file-name1'].data['item1'].versions['1633111200000']).to.deep.equal({
      timestamp: '1633111200000',
      attribute1: 'value1',
      attribute2: 'value2'
    });
    expect(state.dataSources['file-name1'].metadata).to.have.property('attribute1');
  });

it('processWebSocketMessage with existing data', () => {
    // Add some initial data to the dataStore
    dataStore.update(draft => {
        draft.dataSources['file-name1'] = {
            data: {
                'item0': {
                    id: 'item0',
                    versions: {
                        '1633111100000': {
                            timestamp: '1633111100000',
                            attribute1: 'initialValue1',
                            attribute2: 'initialValue2'
                        }
                    }
                }
            },
            metadata: {
                attribute1: {
                    name: 'attribute1',
                    type: 'string',
                    unitSymbol: '# Items',
                },
                attribute2: {
                    name: 'attribute2',
                    type: 'string',
                    unitSymbol: '# Unique Items',
                }
            },
            lastUpdate: '1633111100000',
            type: 'websocket',
            name: 'file-name1'
        };
    });

    processWebSocketMessage(webSocketMessage);

    // Check that the new data has been added to the existing data source
    expect(state.dataSources['file-name1'].data).to.have.property('item1');
    expect(state.dataSources['file-name1'].data['item1'].versions['1633111200000']).to.deep.equal({
        timestamp: '1633111200000',
        attribute1: 'value1',
        attribute2: 'value2'
    });

    // Check that the existing data has not been removed
    expect(state.dataSources['file-name1'].data).to.have.property('item0');
    expect(state.dataSources['file-name1'].data['item0'].versions['1633111100000']).to.deep.equal({
        timestamp: '1633111100000',
        attribute1: 'initialValue1',
        attribute2: 'initialValue2'
    });
});

  it('deleteDataSource', () => {
    const dataSourceName = 'file-name1';

    // Add a data source to the store
    dataStore.update(draft => {
      draft.dataSources[dataSourceName] = {
        data: {},
        metadata: {},
        lastUpdate: '1633111200000',
        type: 'websocket',
        name: dataSourceName
      };
    });

    deleteDataSource(dataSourceName);

    expect(state.dataSources).not.to.have.property(dataSourceName);
  });
});