// Modules
import Database from '../database.js';

// Database object
let database = new Database();
await database.connect();

// Get values
let collections = await database.getCollectionPictures(2);
console.log(collections);
