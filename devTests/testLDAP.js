// Modules
import {auth} from '../ldap.js';

// Auth user
await auth('Admin', '123456789');

process.exit();
