from fastapi import WebSocket
from typing import Dict, List
from uuid import UUID


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[UUID, List[WebSocket]] = {}

    async def connect(self, exchange_id: UUID, websocket: WebSocket):
        await websocket.accept()

        if exchange_id not in self.active_connections:
            self.active_connections[exchange_id] = []

        self.active_connections[exchange_id].append(websocket)

    def disconnect(self, exchange_id: UUID, websocket: WebSocket):
        connections = self.active_connections.get(exchange_id, [])
        if websocket in connections:
            connections.remove(websocket)

    async def broadcast(self, exchange_id: UUID, message: dict):
        for connection in self.active_connections.get(exchange_id, []):
            await connection.send_json(message)


manager = ConnectionManager()
