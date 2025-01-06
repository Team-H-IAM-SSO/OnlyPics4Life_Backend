// Modules
import Database from "./database.js";
import {login} from "./ldap.js";
import config from './config.json';


// Init database connection
let client = new Database();
await client.connect();


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
const DEBUG = true;


// HTTP server
const server = Bun.serve({
    port: config.appPort,
    idleTimeout: 10,
    async fetch(request) {
        // Req url
        const url = new URL(request.url);

        // Login path
        if(url.pathname === '/login') {
            const username = request.headers.get("username");
            const password = request.headers.get("password");

            if(DEBUG) {
                console.log('Login :', username);
                console.log('Password :', password);
            }

            // Check values
            if(username === null || password === null) {
                return new Response('Error on login query', {status: 503});
            }            

            // Request LDAP
            let valid = await login(username, password);
            let res = {
                "login": valid
            };
            
            // Respond login
            return new Response(JSON.stringify(res), {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }


        // Get pics
        if(url.pathname === '/album-pictures') {
            const albumID = request.headers.get("album-id");
        }


        // Fallback
        return new Response("Not implemented.");
    },
});
  
console.log(`Server started on port ${server.port} !`);
