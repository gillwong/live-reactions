import { randomUUID } from "crypto";
import { WebSocket, WebSocketServer } from "ws";
import type { Message } from "./types";

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

const clients = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  const id = randomUUID();
  clients.set(id, ws);

  ws.on("error", (err) => console.error(`Error: ${err.message}`));

  ws.on("message", (message) => {
    const parsed = JSON.parse(message.toString()) as Message;
    if (parsed.type === "message") {
      for (const [client, socket] of clients) {
        console.log({ client, id, len: clients.size });
        if (client !== id) {
          console.log("sending replies")
          socket.send(JSON.stringify(parsed));
        }
      }
    } else {
      const reply = JSON.stringify({
        type: "error",
        content: "Invalid message",
      });
      ws.send(reply);
    }
  });

  ws.on("close", () => clients.delete(id));
});
