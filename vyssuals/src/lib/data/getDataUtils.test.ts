import { expect } from 'chai';
import { getWebSocketDataSources, getFileDataSources, getItemAttributesByTimestamp, getItemAttributesAtLatestUpdate, getUniqueValuesForKeyAtLatestUpdate } from './getDataUtils';
import type { Store, DataSource } from '../types';

describe('Data Utils', () => {
    const mockDataSource: DataSource = {
        data: {
            "item1": {
                id: "item1",
                versions: {
                    "2022-01-01T00:00:00Z": {
                        timestamp: "2022-01-01T00:00:00Z",
                        count: 1,
                        attribute1: "value1",
                        attribute2: 2
                    },
                    "2022-01-02T00:00:00Z": {
                        timestamp: "2022-01-02T00:00:00Z",
                        count: 1,
                        attribute1: "value2",
                        attribute2: 3
                    }
                }
            },
            "item2": {
                id: "item2",
                versions: {
                    "2022-01-01T00:00:00Z": {
                        timestamp: "2022-01-01T00:00:00Z",
                        count: 1,
                        attribute1: "value3",
                        attribute2: 4
                    },
                    "2022-01-02T00:00:00Z": {
                        timestamp: "2022-01-02T00:00:00Z",
                        count: 1,
                        attribute1: "value4",
                        attribute2: 5
                    }
                }
            }
        },
        metadata: {
            attribute1: {
                name: "attribute1",
                type: "string",
                unitSymbol: "# Items"
            },
            attribute2: {
                name: "attribute2",
                type: "number",
                unitSymbol: "# Items"
            }
        },
        lastUpdate: "2022-01-02T00:00:00Z",
        type: "file",
        name: "mockDataSource"
    };

    const mockStore: Store = {
        dataSources: {
            mockDataSource: mockDataSource
        }
    };

    describe('getWebSocketDataSources', () => {
        it('should return an empty array as there are no WebSocket data sources', () => {
            const result = getWebSocketDataSources(mockStore);
            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('getFileDataSources', () => {
        it('should return an array containing the name of the mock data source', () => {
            const result = getFileDataSources(mockStore);
            expect(result).to.be.an('array').that.includes('mockDataSource');
        });
    });

    describe('getItemAttributesByTimestamp', () => {
        it('should return an empty array for a non-existent timestamp', () => {
            const result = getItemAttributesByTimestamp(mockDataSource, 'nonExistentTimestamp');
            expect(result).to.be.an('array').that.is.empty;
        });

        it('should return an array of Attributes for an existing timestamp', () => {
            const result = getItemAttributesByTimestamp(mockDataSource, '2022-01-01T00:00:00Z');
            expect(result).to.be.an('array').that.is.not.empty;
            expect(result[0]).to.have.property('attribute1');
            expect(result[0]).to.have.property('attribute2');
        });
    });

    describe('getItemAttributesAtLatestUpdate', () => {
        it('should return an array of Attributes for the latest update', () => {
            const result = getItemAttributesAtLatestUpdate(mockDataSource);
            expect(result).to.be.an('array').that.is.not.empty;
            expect(result[0]).to.have.property('attribute1');
            expect(result[0]).to.have.property('attribute2');
        });
    });

    describe('getUniqueValuesForKeyAtLatestUpdate', () => {
        it('should return an array of unique values for an existing key', () => {
            const result = getUniqueValuesForKeyAtLatestUpdate(mockDataSource, 'attribute1');
            expect(result).to.be.an('array').that.includes('value2', 'value4');
        });

        it('should return an empty array for a non-existent key', () => {
            const result = getUniqueValuesForKeyAtLatestUpdate(mockDataSource, 'nonExistentKey');
            expect(result).to.be.an('array').that.is.empty;
        });
    });
});