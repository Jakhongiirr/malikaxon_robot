import * as dotenv from "dotenv";

(() => dotenv.config())();

const env = process.env;

export { env };
