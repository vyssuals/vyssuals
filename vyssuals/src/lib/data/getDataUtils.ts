import type { Attributes, DataSource, HeaderData, Store } from '../types';

export function getWebSocketDataSources(draft: Store): string[] {
    return Object.values(draft.dataSources).filter(dataSource => dataSource.type === 'websocket').map(dataSource => dataSource.name);
}

export function getFileDataSources(draft: Store): string[] {
    return Object.values(draft.dataSources).filter(dataSource => dataSource.type === 'file').map(dataSource => dataSource.name);
}


export function getLatestAttributes(dataSource: DataSource): Attributes[] {
  var itemIds = dataSource.updates.getLastUpdate();
  return itemIds.map(itemId => {
      return dataSource.data[itemId].getLastUpdate();
  });
}

// export function getUniqueValuesForKeyAtLatestUpdate(dataSource: DataSource, key: string): string[] {
//   return Array.from(
//     new Set(
//       Object.values(dataSource.data)
//         .map(item => {
//           const latestVersion = item.versions[dataSource.lastUpdate];
//           return latestVersion ? latestVersion[key] : undefined;
//         })
//         .filter(value => value !== undefined && value !== null) // This line will remove undefined and null values
//         .map(value => (value as string).toString()) // Type assertion here
//     )
//   );
// }

export function getUniqueValuesForKey(attributes: Attributes[], key: string): (string | number)[] {
  return Array.from(
    new Set(
      attributes.map(attribute => attribute[key])
    )
  );
}

export function getUniqueAttributeKeys(attributes: Attributes[]): string[] {
  return Array.from(
    new Set(
      attributes.flatMap(attribute => Object.keys(attribute))
    )
  );
}

// export function getUniqueAttributeKeys(dataSource: DataSource): string[] {
//   return Array.from(
//     new Set(
//       Object.values(dataSource.data)
//         .flatMap(item => Object.keys(item.versions[dataSource.lastUpdate]))
//     )
//   );
// }

export function getDataSourceList(draft: Store): DataSource[] {
  return Object.values(draft.dataSources);
}

export function getDataSourceHeaderDataList(dataSource: DataSource): HeaderData[] {
  return Object.values(dataSource.metadata);
}

