import asyncio
import websockets
import json

# List to store all active WebSocket connections
websockets_list = []

async def websocket_server(websocket, path):
    # Add the new WebSocket connection to the list
    websockets_list.append(websocket)
    print('Client connected')

    try:
        # Forward messages from this client to all other clients
        async for message in websocket:
            print(f"Received message from client: {message}")
            for other_websocket in websockets_list:
                if other_websocket != websocket:
                    await other_websocket.send(message)
    finally:
        # Remove the WebSocket connection from the list when it's closed
        websockets_list.remove(websocket)
        print('Client disconnected')

async def main():
    # Start the server
    server = websockets.serve(websocket_server, 'localhost', 8184)

    # Create an event that will never be set
    stop = asyncio.Event()

    # Wait for the server to become ready
    await server

    # Wait for the event to be set (which will never happen)
    await stop.wait()

# Run the main function
asyncio.run(main())