from typing import List, Optional, Union
import json

class Item:
    def __init__(self, id: str, versions: 'Version'):
        self.id = id
        self.versions = versions

class Version:
    def __init__(self, timestamp: str, attributes):
        setattr(self, timestamp, attributes)

class Update:
    def __init__(self, timestamp: str, type: str, name: str, visible_item_ids: List[str]):
        self.timestamp = timestamp
        self.type = type
        self.name = name
        self.visibleItemIds = visible_item_ids

class Header:
    def __init__(self, name: str, type: str, unit_symbol: str, unique_values: Optional[int] = None, cardinality_ratio: Optional[float] = None):
        self.name = name
        self.type = type
        self.unitSymbol = unit_symbol
        self.uniqueValues = unique_values
        self.cardinalityRatio = cardinality_ratio

class DataPayload:
    def __init__(self, data: Optional[List[Item]] = None, metadata: Optional[List[Header]] = None, update: Optional[Update] = None):
        self.data = data
        self.metadata = metadata
        self.update = update

class WebSocketMessage:
    def __init__(self, type: str, timestamp: str, version: str, sender: str, sender_version: str, sender_name: str, payload: Optional[DataPayload] = None):
        self.type = type
        self.timestamp = timestamp
        self.version = version
        self.sender = sender
        self.senderVersion = sender_version
        self.senderName = sender_name
        self.payload = payload

class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            return obj.__dict__
        else:
            return json.JSONEncoder.default(self, obj)