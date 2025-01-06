// Modules
import {authenticate} from 'ldap-authentication';
import config from './config.json';


// Log normal user
export function auth(username, password) {
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
  
    authenticate(options).then(user => {
      console.log(user);
      resolve(user);
    }).catch(e => {
      reject(e);    
    });
  });
}
