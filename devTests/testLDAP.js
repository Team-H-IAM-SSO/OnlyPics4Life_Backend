// Modules
import {login} from '../ldap.js';

// Auth user
let valid = await login('Admin', '123456789').catch(console.error);
console.log(`Login valid : ${valid}`);


process.exit();
