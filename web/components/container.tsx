"use client";

import { useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import type { Location } from "@/utils/types";
import Reaction from "./reaction";

const MotionReaction = motion(Reaction);

export default function Container() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!parentRef.current) return;
    const bounds = parentRef.current.getBoundingClientRect();
    setLocations((prev) => [
      ...prev,
      {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      },
    ]);
  }

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
          key={`${loc.x}-${loc.y}`}
          location={loc}
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
