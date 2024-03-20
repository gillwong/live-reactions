export type Location = {
  x: number;
  y: number;
};

export type Message = {
  type: "message";
  content: string;
  location: Location;
};

export type ErrorMessage = {
  type: "error";
  content: string;
};

export type GenericMessage<T extends "message" | "string"> = T extends "message"
  ? Message
  : ErrorMessage;
