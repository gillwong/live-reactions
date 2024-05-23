"use client";

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import Reaction from "@/components/reaction";
import { emojiContext } from "@/components/emoji-context";
import type { GenericMessage, Location } from "@/utils/types";

const MotionReaction = motion(Reaction);

export default function Container() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [emoji] = useContext(emojiContext);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [locations, setLocations] = useState<
    { content: string; location: Location }[]
  >([]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!parentRef.current) return;
    const bounds = parentRef.current.getBoundingClientRect();
    const location: Location = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    setLocations((prev) => [...prev, { content: emoji, location }]);

    const message = JSON.stringify({
      type: "message",
      content: emoji,
      location,
    });
    socket?.send(message);
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080");
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const message = parsed as GenericMessage<typeof parsed.type>;
        switch (message.type) {
          case "message":
            setLocations((prev) => [
              ...prev,
              { content: message.content, location: message.location },
            ]);
            break;
          case "error":
            console.error(message.content);
            break;
        }
      } catch (err) {
        console.error(err);
        console.log("Data: ", event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div ref={parentRef} className="relative">
      <div
        className="bg-white border-2 border-black border-dashed rounded-lg w-full h-64 flex justify-center items-center"
        onClick={handleClick}
      >
        <p>Click inside this box!</p>
      </div>
      {locations.map((loc, idx) => (
        <MotionReaction
          key={`${loc.location.x}-${loc.location.y}`}
          content={loc.content}
          location={loc.location}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onAnimationComplete={() =>
            setLocations((prev) => prev.filter((_, i) => i !== idx))
          }
        />
      ))}
    </div>
  );
}
