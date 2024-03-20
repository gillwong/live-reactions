"use client";

import type { Location } from "@/utils/types";
import { forwardRef, useContext } from "react";
import { emojiContext } from "./emoji-context";

export type ReactionProps = {
  location: Location;
};

const Reaction = forwardRef<HTMLParagraphElement, ReactionProps>(
  function Reaction({ location }, ref) {
    const [emoji] = useContext(emojiContext);

    return (
      <p
        ref={ref}
        className="absolute"
        style={{
          // 12 is half the size of the dot
          left: location.x,
          top: location.y,
        }}
      >
        {emoji}
      </p>
    );
  },
);

export default Reaction;
