// Modules
import {connect} from "./database.js";
import {login} from "./ldap.js";
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
const DEBUG = true;


// HTTP server
const server = Bun.serve({
    port: config.appPort,
    idleTimeout: 10,
    async fetch(request) {
        // Req url
        const url = new URL(request.url);

        // Login path
        if(url.pathname.startsWith('/login')) {
            if(DEBUG) {console.log(`Params : ${decodeURI(url.search)}`);}

            // Get request params
            let params = decodeURI(url.search).replace('?', '').split(',');
            if(!params[0].includes('username=') || !params[1].includes('password=')) {
                return new Response('Error on login query');
            }

            // Login values
            let username = params[0].replace('username=', '');
            let password = params[1].replace('password=', '');
            if(DEBUG) {console.log(`User : ${username}, Password: ${password}`);}
            

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

        // Fallback
        return new Response("Not implemented.");
    },
});
  
console.log(`Server started on port ${server.port} !`);
