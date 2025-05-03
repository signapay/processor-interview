import Elysia, { t } from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { clients } from "@/src/ws/clients";

export enum WSEvents {
  TransactionsUploadSuccess = "TransactionsUploadSuccess",
  TransactionsUploadFail = "TransactionsUploadFail",
  TransactionsDeleteSuccess = "TransactionsDeleteSuccess",
}

const validateToken = (token: string): boolean => {
  return token === Bun.env.WS_TOKEN;
};

export const ws = new Elysia().ws("/ws", {
  query: t.Object({
    token: t.String(),
  }),
  open(ws: ElysiaWS<{ query: { token: string } }>) {
    const { token } = ws.data?.query || {};
    if (!validateToken(token)) {
      ws.close();
      return;
    }
    clients.add(ws);
  },
  close(ws: ElysiaWS) {
    clients.delete(ws);
  },
});

export const broadcast = async <T>(event: WSEvents, data: T) => {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ event, data }));
    }
  });
};
