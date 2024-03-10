import asyncio
import websockets
import json
import random
import signal
from classes import WebSocketMessage, DataPayload, Item, Versions, ComplexEncoder
from datetime import datetime

# Define possible values for the 'category' attribute
categories = ['walls', 'doors', 'floors', 'windows', 'roofs', 'ceilings', 'stairs']
levels = ['level1', 'level2', 'level3']
fire_rating = ['A', 'B', 'C', 'D', 'E', 'F']
heights = [3.5, 4.22, 4.5, 7]
some_long_parameter_name = ['Alphaaaaaaaaaaaaaaaa', 'Betaaaaaaaaaaa', 'Gammaaaaa', 'Deltaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Epsilonaaaa', 'Zetaaaaa']
data_sources = ['Revit-2022__836_Project-Name', 'Rhino-8__2402_DR_some-long-filename', 'Csv_brutally-long-filename-2023-02-23_randomShit']

def get_random_element(array):
    return random.choice(array)

def get_random_number(min, max):
    return random.randint(min, max)

def generate_dummy_data(data_source, count):
    data = []
    for i in range(count):
        versions = Versions(
            timestamp=str(datetime.now()),
            attributes={
            'area': get_random_number(1, 10), # Generate a random value for 'area'
            'category': get_random_element(categories), # Select a random category
            'level': get_random_element(levels), # Select a random level
            'fireRating': get_random_element(fire_rating) if 'walls' in categories or 'floors' in categories else None, # Generate a random value for 'fireRating' if the category is 'walls' or 'floors'
            'height': get_random_element(heights) if 'walls' in categories else None, # Generate a random value for 'height' if the category is 'walls'
            'someLongParameterName': get_random_element(some_long_parameter_name), # Select a random value for 'someLongParameterName'
            }
        )
        item = Item(id=str(get_random_number(1, 1000000)), versions=versions)
        data.append(item)

    payload = DataPayload(data=data)
    message = WebSocketMessage(
        type='data',
        timestamp=str(datetime.now()),
        version='1.0',
        sender='server',
        sender_version='1.0',
        sender_name='Server',
        payload=payload
    )

    return message
        

async def server(websocket, path):
    print('Client connected')

    async def handle_message():
        async for message in websocket:
            print(f"Received message from client: {message}")

    async def send_dummy_data():
        try:
            while True:
                data_source = get_random_element(data_sources)
                count = get_random_number(1, 100)
                dummy_data = generate_dummy_data(data_source, count)
                await websocket.send(json.dumps(dummy_data, cls=ComplexEncoder))
                print('Sent more dummy data')
                await asyncio.sleep(10) # sleep for 5 seconds
        except websockets.exceptions.ConnectionClosed:
            print('Client disconnected')

    # Run the message handler and dummy data sender concurrently
    await asyncio.gather(handle_message(), send_dummy_data())

start_server = websockets.serve(server, 'localhost', 8184)

loop = asyncio.get_event_loop()

# Add a signal handler for SIGINT
def shutdown(signal, loop):
    print(f"Received exit signal {signal.name}...")
    loop.stop()

for signame in {'SIGINT', 'SIGTERM'}:
    loop.add_signal_handler(
        getattr(signal, signame),
        shutdown,
        getattr(signal, signame),
        loop,
    )

try:
    loop.run_until_complete(start_server)
    loop.run_forever()
except KeyboardInterrupt:
    pass
finally:
    print("Closing the loop...")
    loop.close()