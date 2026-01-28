import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

interface Room {
  clients: Set<WebSocket>;
  code: string;
}

const rooms = new Map<string, Room>();

export function setupCollaboration(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/collaborate" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
      ws.close();
      return;
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, { clients: new Set(), code: "" });
    }

    const room = rooms.get(roomId)!;
    room.clients.add(ws);

    // Send current code to new client
    ws.send(JSON.stringify({ type: "sync", code: room.code }));

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "change") {
        room.code = data.code;
        // Broadcast to all other clients in the room
        room.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "change", code: room.code }));
          }
        });
      }
    });

    ws.on("close", () => {
      room.clients.delete(ws);
      if (room.clients.size === 0) {
        rooms.delete(roomId);
      }
    });
  });

  console.log("Collaboration WebSocket server setup on /ws/collaborate");
}
