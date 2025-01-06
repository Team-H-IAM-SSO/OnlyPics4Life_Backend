// Modules
import {auth} from '../ldap.js';

// Auth user
let user = await auth('Admin', '123456789').catch(console.error);

process.exit();
