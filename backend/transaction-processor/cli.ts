import Interfaces from "./interfaces";

Interfaces.CLI.run().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

