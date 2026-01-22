const http = require('http');

function get(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log(`Failed to parse JSON for ${path}:`, data);
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

async function verify() {
    try {
        console.log('--- Departments ---');
        const depts = await get('/api/departments');
        console.log(JSON.stringify(depts, null, 2));

        console.log('\n--- Employees ---');
        const emps = await get('/api/employees');
        console.log(JSON.stringify(emps, null, 2));

        console.log('\n--- Search (John) ---');
        const search = await get('/api/employees/search?q=John');
        console.log(JSON.stringify(search, null, 2));

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verify();
