import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Street Food Discovery Website SERVER IS RUNNING ON PORT: ${config.port}`);
  });
}
main();
