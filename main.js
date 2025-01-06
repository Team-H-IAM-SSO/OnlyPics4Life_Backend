// Modules
import Database from "./database.js";
import {join} from "path";
import fs from 'fs';
import {login} from "./ldap.js";
import config from './config.json';


// Init database connection
let database = new Database();
await database.connect();

// Config
const allowedFormats = ['.png', '.jpg', '.jpeg', '.raw', '.tif', '.webp', '.gif'];


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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }


        // Get album pics
        if(url.pathname === '/album-pictures') {
            const collectionID = request.headers.get("collection-id");

            let picturesPath = await database.getCollectionPictures(collectionID);
            let res = {
                "collectionID": collectionID,
                "picturesPath": picturesPath
            };

            return new Response(JSON.stringify(res), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }


        // Get picture
        if(url.pathname.startsWith('/photos')) {
            // Get path
            let photoPath = url.pathname.replace('/photos/', '');

            // Check format
            let valid = false;
            for(let i = 0; i < allowedFormats.length; i++) {
                if(photoPath.endsWith(allowedFormats[i])) {
                    valid = true;
                    break;
                }
            }

            // Return pic
            if(valid) {
                try {                    
                    let filePath = join(config.PICTURES.basePath, url.pathname.replace('/extes', '/'));
                    const file = await fs.promises.readFile(filePath);
                    const contentType = getContentType(filePath);

                    return new Response(file, {
                        status: 200,
                        headers: {
                            "Content-Type": contentType
                        }
                    });
                } catch (error) {
                    console.error("Error while reading file", error);
                    return new Response("Error reading file", { status: 403 });
                }
            } else {
                return new Response("Picture path not in a good form", { status: 403 });
            }
        }


        // Fallback
        return new Response("Not implemented.");
    },
});
  
console.log(`Server started on port ${server.port} !`);
