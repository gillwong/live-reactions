"use client";

import { emojis } from "@/utils/constants";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const emojiContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>([emojis[0], () => {}]);

export default function EmojiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [emoji, setEmoji] = useState(emojis[0]);
  return (
    <emojiContext.Provider value={[emoji, setEmoji]}>
      {children}
    </emojiContext.Provider>
  );
}
