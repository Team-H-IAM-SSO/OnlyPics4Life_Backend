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
      userDn: `dc=onlypics4,dc=life`,
      userPassword: password,
      userSearchBase: 'dc=onlypics4,dc=life',
      usernameAttribute: 'cn',
      username: username,
      // starttls: false
    };
  
    let user = await authenticate(options);
    console.log(user);
}


// Log with admin
export async function authAdmin(username, password) {
    let options = {
        ldapOpts: {
            url: `ldap://${config.LDAP.host}`,
            // tlsOptions: { rejectUnauthorized: false }
        },
        adminDn: 'cn=read-only-admin,dc=example,dc=com',
        adminPassword: 'password',
        userPassword: password,
        userSearchBase: 'dc=example,dc=com',
        usernameAttribute: 'uid',
        username: username,
        // starttls: false
    };

    let user = await authenticate(options);
    console.log(user);
}
