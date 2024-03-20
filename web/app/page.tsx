import Container from "@/components/container";
import EmojiSelection from "@/components/emoji-selection";

export default function Home() {
  return (
    <main className="w-full min-h-full space-y-6 p-6">
      <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        WebSocket Demo!
      </h1>
      <Container />
      <EmojiSelection />
    </main>
  );
}
