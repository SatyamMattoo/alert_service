import dotenv from "dotenv";

const result = dotenv.config();

interface EnvConfig {
  [key: string]: string;
}

if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;

export default envs as EnvConfig;
