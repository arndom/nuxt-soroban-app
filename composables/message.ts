export const useFetchLastMessage = () =>
  useState<string>("lastMessage", () => "...");
