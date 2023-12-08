import { Server } from "./src/Server"
import { config } from "./src/config/config";
import * as Winston from "winston";

async function main() {
    const transports: Winston.transport[] = [
        new Winston.transports.Console()
    ];

    const logger = Winston.createLogger({
        level: config.loggingLevel,
        format: Winston.format.json(),
        transports
    });

    const server = new Server(logger);
    await server.start();
}

main();