import { app } from "./app";

app.listen(Bun.env.PORT || 3000);

console.log("HTTP on http://localhost:3000");
console.log("WS on ws://localhost:3000/ws");
