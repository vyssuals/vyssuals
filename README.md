# 🌈 Vyssuals
This is the repo for [Vyssuals.com](https://vyssuals.com), an open-source data visualisation web app that allows you to create charts from various data sources.

## ☎️ Connectors
Vyssuals can be connected to any desktop software using connectors (Given you can write plugins for it).

Currently available connectors:
- [Revit](https://github.com/vyssuals/vyssuals-connector-revit)

## 🔮 Roadmap 
Here are some suggested features may be implemented in the future:
- Functionality for deleting updates
- More chart types
  - K-Means Clustering Chart
- Ability to select a bar/pie/... piece to highlight corresponding elements in Revit/...
  - Evaluate if this should also filter other charts 
- Archicad connector
- GraphQL connector
- Select between custom color / color palette and color gradient
- Add deleted marker to item

Feel free to suggest and contribute improvements!
  
# 🚀 Getting Started 
You can find a tutorial [here](https://yssentyl.com/blog/real-time-data-visualization-for-revit-with-vyssuals-com)

# Technical Overview
Vyssuals uses a WebSocket connection to transfer data from a desktop application to the web app. It utilizes a ws-client inside the connector that tries to connect to an existing [vyssuals-websocket-server](https://github.com/vyssuals/vyssuals-websocket-server). If the client in the connector does not find a server, it spins up one itself and then connects to it.

The data in the web app is stored inside indexeddb using dexie, separeted by datasource. There are 3 tables per datasource:
- **Updates**. This keeps track of the items 'visible' or 'included' when the data was recieved.
- **Headers**. Contains metadata about the 'columns' or 'parameters' in the data.
- **Items**. All items ever sent from that datasource. An Item has 'versions' of its parameters and their values. This allows to track changes over time.
