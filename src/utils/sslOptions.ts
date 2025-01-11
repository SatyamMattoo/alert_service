import fs from "fs";

export const sslOptions = {
  ca: [fs.readFileSync("./certificates/ca.pem")], // Path to CA certificate
  cert: fs.readFileSync("./certificates/service.cert"), // Path to client certificate
  key: fs.readFileSync("./certificates/service.key"), // Path to client key
  rejectUnauthorized: true, // Ensure certificate validation
};