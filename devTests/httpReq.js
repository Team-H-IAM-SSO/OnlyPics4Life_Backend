function requestLogin() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:6969/login', {
            method: 'GET',
            headers: {
                'username': 'Admin',
                'password': '123456789'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    return resolve(data);
                });
            } else {
                response.text().then(text => {
                    return reject(text);
                });
            }
        }).catch(error => {
            console.error(error);
        });
    });
}


let log = await requestLogin();
console.log(`Logged in:\n`, log);
