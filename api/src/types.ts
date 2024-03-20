export type Message = {
  type: "message";
  content: string;
  location: {
    x: number;
    y: number;
  }
}
