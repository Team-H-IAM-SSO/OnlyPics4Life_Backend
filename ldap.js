// Modules
import {authenticate} from 'ldap-authentication';
import config from './config.json';


// Log normal user
export async function auth(username, password) {
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
  }).catch(e => {
    console.error(e);    
  });
}
