// Modules
import {login} from '../ldap.js';

// Auth user
let user = await login('Admin', '123456789').catch(console.error);

process.exit();
