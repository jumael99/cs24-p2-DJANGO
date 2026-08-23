import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

// Cloudflare Workers httpServerHandler attaches to the express app
app.listen(3000);

export default httpServerHandler({ port: 3000 });
