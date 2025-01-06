// Modules
import {Client} from 'pg';
import config from './config.json';

// DEBUG
const DEBUG = false;


// Database object
export default class Database {
    constructor() {
        this.client = new Client({
            host: config.SQL.host,
            database: config.SQL.database,
            port: config.SQL.port,
            user: config.SQL.username,
            password: config.SQL.password
        });

        // Bind functions
        this.connect = this.connect.bind(this);
    }

    // Connect to DB
    async connect() {
        await this.client.connect().then(() => {
            console.log(`Database connected on ${config.SQL.host}:${config.SQL.port}`);
        }).catch(console.error);
    }


    // ---- COLLECTIONS FUNCTIONS ----
    createCollection(name, description, photographerID, clientID) {
        return new Promise((resolve, reject) => {
            this.client.query(`
                INSERT INTO photo_collection(name, description, created_by, customer_id)
                VALUES($1::text, $2::text, $3::int, $4::int) RETURNING id;
            `,
            [name, description, photographerID, clientID],
            (err, res) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }

                resolve(res.rows[0].id);
            });
        });
    }

    getCollectionPictures(collectionID) {
        return new Promise((resolve, reject) => {
            this.client.query(`
                SELECT ph.id, ph.file_path, ph.uploaded_at
                FROM photo_collection pc
                LEFT JOIN collection_photos cp ON cp.collection_id=pc.id
                LEFT JOIN photos ph ON cp.photo_id=ph.id
                WHERE pc.id=$1::int
                ORDER BY ph.file_path ASC, ph.uploaded_at ASC;
            `,
            [collectionID],
            (err, res) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }

                resolve(res.rows);
            });
        });
    }


    // ---- PHOTOS FUNCTIONS ----
    createPhoto(photoPath, collectionID) {
        return new Promise((resolve, reject) => {
            this.client.query(`INSERT INTO photos(file_path, uploaded_at) VALUES ($1::text, NOW()) RETURNING ID;`,
            [photoPath],
            (err, res) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                let photoID = res.rows[0].id;

                this.client.query(`
                    INSERT INTO collection_photos(collection_id, photo_id)
                    VALUES ($1::int, $2::int);`,
                [collectionID, photoID],
                err => {
                    if(err) {
                        console.error(err);
                        reject(err);
                    }

                    resolve();
                });
            });
        });
    }


    // ---- LOGIN FUNCTIONS ----
    storeUUID(UUID, userID) {
        return new Promise((resolve, reject) => {
            this.client.query(`INSERT INTO user_connections(token, user_id, creation) VALUES ($1::text, $2::int, NOW());`,
            [UUID, userID],
            err => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                
                resolve();
            });
        });
    }

    testUUID(UUID) {
        return new Promise((resolve, reject) => {
            if(UUID.trim() === "" || UUID === null) {resolve(false);}
            
            this.client.query(`SELECT * FROM user_connections WHERE token=$1::text;`,
            [UUID],
            async (err, res) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                
                if(res.rowCount > 0) {
                    let dt = res.rows[0].creation;

                    // Token expired
                    if((new Date()).getTime() - dt.getTime() > config.LDAP.login_expiration_s * 1000) {
                        await deleteUUID(res.rows[0].user_id);

                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            });
        });
    }

    deleteUUID(userID) {
        return new Promise((resolve, reject) => {
            this.client.query(`DELETE FROM user_connections WHERE user_id=$1::int;`,
            [userID],
            err => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                
                resolve();
            });
        });
    }
}
