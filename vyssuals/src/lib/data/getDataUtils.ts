import type { Attributes, DataSource, HeaderData, Store } from '../types';

export function getWebSocketDataSources(draft: Store): string[] {
    return Object.values(draft.dataSources).filter(dataSource => dataSource.type === 'websocket').map(dataSource => dataSource.name);
}

export function getFileDataSources(draft: Store): string[] {
    return Object.values(draft.dataSources).filter(dataSource => dataSource.type === 'file').map(dataSource => dataSource.name);
}

export function getItemAttributesByTimestamp(dataSource: DataSource, timestamp: string): Attributes[] {
    return Object.values(dataSource.data)
      .flatMap(item => item.versions[timestamp])
      .filter(Boolean); // This line will remove undefined values
  }

export function getItemAttributesAtLatestUpdate(dataSource: DataSource): Attributes[] {
    return Object.values(dataSource.data).map(item => item.versions[dataSource.lastUpdate]);
}

export function getUniqueValuesForKeyAtLatestUpdate(dataSource: DataSource, key: string): string[] {
  return Array.from(
    new Set(
      Object.values(dataSource.data)
        .map(item => {
          const latestVersion = item.versions[dataSource.lastUpdate];
          return latestVersion ? latestVersion[key] : undefined;
        })
        .filter(value => value !== undefined && value !== null) // This line will remove undefined and null values
        .map(value => (value as string).toString()) // Type assertion here
    )
  );
}

export function getUniqueAttributeKeys(dataSource: DataSource): string[] {
  return Array.from(
    new Set(
      Object.values(dataSource.data)
        .flatMap(item => Object.keys(item.versions[dataSource.lastUpdate]))
    )
  );
}

export function getDataSourceList(draft: Store): DataSource[] {
  return Object.values(draft.dataSources);
}

export function getDataSourceHeaderDataList(dataSource: DataSource): HeaderData[] {
  return Object.values(dataSource.metadata);
}