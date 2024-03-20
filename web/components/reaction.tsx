import { forwardRef } from "react";
import type { Location } from "@/utils/types";

export type ReactionProps = {
  content: string;
  location: Location;
};

const Reaction = forwardRef<HTMLParagraphElement, ReactionProps>(
  function Reaction({ content, location }, ref) {
    return (
      <p
        ref={ref}
        className="absolute text-5xl"
        style={{
          // 24 is the size of the Emoji (guessing)
          left: location.x - 24,
          top: location.y - 24,
        }}
      >
        {content}
      </p>
    );
  },
);

export default Reaction;
