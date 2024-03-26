import sys
import websockets
import json
from classes import ComplexEncoder
from ws_dummydata import generate_dummy_data
import asyncio
import websockets


async def send_data():
    async with websockets.connect('ws://localhost:8184') as websocket:
        while True:
            # Wait for the user to press enter
            input("Press enter to send data: ")
            dummy_data = generate_dummy_data()
            jstring = json.dumps(dummy_data, cls=ComplexEncoder)
            # Serialize the message to JSON
            message_json = json.dumps(dummy_data, default=lambda o: o.__dict__)

            # Print the size of the serialized message
            print(sys.getsizeof(message_json))
            
            await websocket.send(jstring)
            
# Start the client
asyncio.run(send_data())