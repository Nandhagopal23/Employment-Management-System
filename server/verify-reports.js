const http = require('http');

let adminToken = '';

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // Try parsing JSON, else return raw string (for CSV)
                    if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
                        resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
                    } else {
                        resolve({ status: res.statusCode, body: data, headers: res.headers });
                    }
                } catch (e) { resolve({ status: res.statusCode, body: data, headers: res.headers }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    try {
        console.log('1. Login Admin...');
        const login = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
        adminToken = login.body.token;
        if (!adminToken) throw new Error('Login failed');
        console.log('Got Token.');

        console.log('\n2. Trigger Audit Leg (Create Dept)...');
        const dept = await request('POST', '/api/departments', { name: 'AuditTest', description: 'Testing Audits' }, adminToken);
        console.log('Dept Created:', dept.status === 201);

        console.log('\n3. Get Audit Logs...');
        const logs = await request('GET', '/api/reports/audit-logs', null, adminToken);
        const lastLog = logs.body[0];
        console.log('Logs found:', logs.body.length > 0);
        console.log('Last Action:', lastLog ? `${lastLog.action} on ${lastLog.entity_type}` : 'None');

        console.log('\n4. Get Salary Stats...');
        const stats = await request('GET', '/api/reports/salary-stats', null, adminToken);
        console.log('Stats Response:', JSON.stringify(stats.body[0] || stats.body, null, 2));

        console.log('\n5. Export CSV...');
        const csv = await request('GET', '/api/reports/export-csv', null, adminToken);
        console.log('CSV Content Type:', csv.headers['content-type']);
        console.log('CSV Length:', csv.body.length);
        console.log('CSV Preview:\n', csv.body.substring(0, 100) + '...');

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

run();
