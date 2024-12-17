// Modules
import {connect} from "./database.js";
import {auth, authAdmin} from "./ldap.js";
import config from './config.json';


// Init database connection
await connect();


// Get files content type
function getContentType(filePath) {
    if (filePath.endsWith(".html")) return "text/html";
    if (filePath.endsWith(".js")) return "application/javascript";
    if (filePath.endsWith(".css")) return "text/css";
    if (filePath.endsWith(".json")) return "application/json";
    if (filePath.endsWith(".png")) return "image/png";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
    if (filePath.endsWith(".svg")) return "image/svg+xml";
    if (filePath.endsWith(".ico")) return "image/x-icon";
    if (filePath.endsWith(".mp4")) return "video/mp4";
    if (filePath.endsWith(".mp3")) return "audio/mp3";
    return "text/plain";
}


// DEBUG
const DEBUG = false;


// HTTP server
const server = Bun.serve({
    port: config.appPort,
    idleTimeout: 10,
    async fetch(request) {
        // Req url
        const url = new URL(request.url);

        // Login path
        if(url.pathname.startsWith('/login')) {
            console.log(`Params : ${url.searchParams}`);
            
            return new Response('Damn boi',{
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }     


        return new Response("Not implemented.");
    },
});
  
console.log(`Server started on port ${server.port} !`);
