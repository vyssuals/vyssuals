from typing import List, Optional, Union
import json

class Item:
    def __init__(self, id: str, versions: 'Versions'):
        self.id = id
        self.versions = versions

class Versions:
    def __init__(self, timestamp: str, values: List[Union[str, float]]):
        self.timestamp = timestamp
        self.values = values

class Update:
    def __init__(self, timestamp: str, type: str, name: str, visible_item_ids: List[str]):
        self.timestamp = timestamp
        self.type = type
        self.name = name
        self.visible_item_ids = visible_item_ids

class Header:
    def __init__(self, name: str, type: str, unit_symbol: str, unique_values: Optional[int] = None, cardinality_ratio: Optional[float] = None):
        self.name = name
        self.type = type
        self.unit_symbol = unit_symbol
        self.unique_values = unique_values
        self.cardinality_ratio = cardinality_ratio

class DataPayload:
    def __init__(self, data: Optional[List[Item]] = None, metadata: Optional[List[Header]] = None, visible_items: Optional[Update] = None):
        self.data = data
        self.metadata = metadata
        self.visible_items = visible_items

class WebSocketMessage:
    def __init__(self, type: str, timestamp: str, version: str, sender: str, sender_version: str, sender_name: str, payload: Optional[DataPayload] = None):
        self.type = type
        self.timestamp = timestamp
        self.version = version
        self.sender = sender
        self.sender_version = sender_version
        self.sender_name = sender_name
        self.payload = payload

class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            return obj.__dict__
        else:
            return json.JSONEncoder.default(self, obj)