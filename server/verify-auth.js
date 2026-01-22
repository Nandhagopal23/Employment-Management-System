const http = require('http');

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function verifyAuth() {
    try {
        console.log('--- 1. Login as Admin ---');
        const loginRes = await request('POST', '/api/auth/login', {
            username: 'admin',
            password: 'admin123' // Matches seed
        });
        console.log('Status:', loginRes.status);
        const token = loginRes.body.token;
        console.log('Token Received:', !!token);

        if (!token) {
            console.error("Login failed, stopping.");
            return;
        }

        console.log('\n--- 2. Access Protected Route (Get Employees) WITH Token ---');
        const protectedRes = await request('GET', '/api/employees', null, token);
        console.log('Status:', protectedRes.status);
        console.log('Success:', protectedRes.status === 200);

        console.log('\n--- 3. Access Protected Route WITHOUT Token ---');
        const unauthorizedRes = await request('GET', '/api/employees');
        console.log('Status:', unauthorizedRes.status);
        console.log('Success (Expected 401):', unauthorizedRes.status === 401);

        console.log('\n--- 4. Register New User ---');
        const registerRes = await request('POST', '/api/auth/register', {
            username: 'newuser',
            password: 'password123',
            role: 'Employee'
        });
        console.log('Status:', registerRes.status);
        console.log('User created:', registerRes.body.username);

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyAuth();
