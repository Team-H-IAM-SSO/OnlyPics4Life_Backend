// Modules
import {Client} from 'pg';
import config from './config.json';

// SQL Client
let client = new Client({
    host: config.SQL.host,
    database: config.SQL.database,
    port: config.SQL.port,
    user: config.SQL.username,
    password: config.SQL.password
});

// Connect client
export async function connect() {
    await client.connect().catch(console.error);
    console.log(`Database connected on ${config.SQL.host}:${config.SQL.port}`);
}


// Database functions
