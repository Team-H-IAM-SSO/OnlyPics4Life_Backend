// Modules
import {authenticate} from 'ldap-authentication';
import config from './config.json';

// DEBUG
const DEBUG = true;


// Log normal user
function auth(username, password) {
  return new Promise((resolve, reject) => {
    let options = {
      ldapOpts: {
        url: `ldap://${config.LDAP.host}`,
        // tlsOptions: { rejectUnauthorized: false }
      },
      userDn: `cn=${username},ou=People,dc=onlypics4,dc=life`,
      userPassword: password,
      userSearchBase: 'dc=onlypics4,dc=life',
      usernameAttribute: 'cn',
      username: username,
      attributes: ['dn', 'sn', 'cn', 'mail'],
      // starttls: false
    };
  
    authenticate(options).then(resolve).catch(reject);
  });
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    auth(username, password).then(user => {
      if(DEBUG) {console.log(user);}

      resolve(true);
    }).catch(e => {
      if(DEBUG) {console.error(e);}

      resolve(false);
    });
  });
}
