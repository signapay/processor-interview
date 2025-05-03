import { useEffect } from "react";
import { wsToken, wsUrl } from "@/utils/env";

type WSHandler = (event: MessageEvent) => void;

export function useWebSocket(onMessage: WSHandler) {
  useEffect(() => {
    const url = `${wsUrl}?token=${encodeURIComponent(wsToken)}`;
    const ws = new WebSocket(url);

    ws.onmessage = onMessage;

    return () => {
      ws.close();
    };
  }, [onMessage]);
}

export enum WSEvents {
  TransactionsUploadSuccess = "TransactionsUploadSuccess",
  TransactionsUploadFail = "TransactionsUploadFail",
  TransactionsDeleteSuccess = "TransactionsDeleteSuccess",
}
