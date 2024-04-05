
import random
from classes import WebSocketMessage, DataPayload, Item, Version, Update, Header
from datetime import datetime


# Define possible values for the 'category' attribute
categories = ['walls', 'doors', 'floors', 'windows', 'roofs', 'ceilings', 'stairs']
levels = ['level1', 'level2', 'level3']
fire_rating = ['A', 'B', 'C', 'D', 'E', 'F']
heights = [3.5, 4.22, 4.5, 7]
some_long_parameter_name = ['Alphaaaaaaaaaaaaaaaa', 'Betaaaaaaaaaaa', 'Gammaaaaa', 'Deltaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Epsilonaaaa', 'Zetaaaaa']

allIds = [str(i) for i in range(100)]

def get_random_element(array):
    return random.choice(array)

def get_random_number(min, max):
    return round(random.uniform(min, max), 2)

def generate_dummy_data():
    data = []
    timestamp = str(datetime.now())
    update = Update(timestamp=timestamp, type='manual', name='example Name', visible_item_ids=[])

    # get subset of allIds  
    ids = random.sample(allIds, 50)
    update.visibleItemIds = ids

    metadata = [
        Header(name='area', type='number', unit_symbol=''),
        Header(name='category', type='string', unit_symbol=''),
        Header(name='level', type='string', unit_symbol=''),
        Header(name='fireRating', type='string', unit_symbol=''),
        Header(name='height', type='number', unit_symbol=''),
        Header(name='someLongParameterName', type='string', unit_symbol=''),
    ]

    for i in range(3):
        metadata.pop(random.randint(0, len(metadata)-1))

    for i in ids:
        if random.choice([True, False]):
            continue

        version = Version(
            timestamp=timestamp,
            attributes={
                'Id': i, # Set the 'Id' attribute to the current value of 'i
            'area': get_random_number(100, 1000), # Generate a random value for 'area'
            'category': get_random_element(categories), # Select a random category
            'level': get_random_element(levels), # Select a random level
            'fireRating': get_random_element(fire_rating) if 'walls' in categories or 'floors' in categories else None, # Generate a random value for 'fireRating' if the category is 'walls' or 'floors'
            'height': get_random_element(heights) if 'walls' in categories else None, # Generate a random value for 'height' if the category is 'walls'
            'someLongParameterName': get_random_element(some_long_parameter_name), # Select a random value for 'someLongParameterName'
            }
        )

        item = Item(id=i, versions=version)
        data.append(item)

    payload = DataPayload(data=data, update=update, metadata=metadata)
    message = WebSocketMessage(
        type='data',
        timestamp=timestamp,
        version='1.0',
        sender='server',
        sender_version='1.0',
        sender_name='Server',
        payload=payload
    )

    return message

