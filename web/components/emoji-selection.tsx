"use client";

import { useContext } from "react";
import { emojiContext } from "./emoji-context";
import { emojis } from "@/utils/constants";

export default function EmojiSelection() {
  const [emoji, setEmoji] = useContext(emojiContext);

  function select(emoji: string) {
    setEmoji(emoji);
  }

  return (
    <div>
      <h2 className="text-center scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Select Your Emoji
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {emojis.map((em) => (
          <button
            key={em}
            className="text-2xl rounded bg-slate-100 hover:bg-slate-200 data-[selected=true]:bg-slate-300 size-12 aspect-square transition"
            onClick={() => select(em)}
            data-selected={em === emoji}
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
